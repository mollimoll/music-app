import SpotifyWebApi from "spotify-web-api-js"

import { credentials } from "./credentials"

// TODO: Research: How does this persist across sessions when hosted?
//   e.g. Will the second visitor be using the auth of the first?
const spotifyApi = new SpotifyWebApi()

export const authToken = async () => {
  const scopes = "user-read-private user-read-email"
  const url =
    "https://accounts.spotify.com/authorize" +
    "?response_type=code" +
    "&client_id=" +
    credentials.clientId +
    (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
    "&redirect_uri=" +
    encodeURIComponent(credentials.redirectUri)

  const auth = await fetch(url)
  return auth
}

const getTrackIdsOfNewAlbums = async (country: string) => {
  const {
    albums: { items },
  } = await spotifyApi.getNewReleases({
    limit: 20,
    offset: 0,
    country,
  })

  const albumIds = items.map((album) => album.id)

  const { albums } = await spotifyApi.getAlbums(albumIds)

  const trackIds = albums
    .map((album) => album.tracks.items)
    .flat()
    .map((track) => track.id)

  return trackIds
}

const getTracksWithAnalyses = async (trackIds: string[]) => {
  const { tracks } = await spotifyApi.getTracks(trackIds.slice(0, 50))

  const { audio_features } = await spotifyApi.getAudioFeaturesForTracks(
    trackIds.slice(0, 50)
  )

  const tracksWithDetails = tracks.map(
    ({ album, available_markets, ...track }) => {
      const features = audio_features.find(
        (features) => features && features.id === track.id
      )

      if (features) {
        return {
          images: album.images,
          album_name: album.name,
          ...track,
          ...features,
        }
      }
    }
  )

  if (trackIds[50]) {
    const additionalTracks = await getTracksWithAnalyses(trackIds.slice(50))
    return [...tracksWithDetails, ...additionalTracks]
  } else {
    return tracksWithDetails
  }
}

const getTracksByBpm = (min: number, max: number, tracks) =>
  tracks.filter((track) => track && track.tempo >= min && track.tempo <= max)

type getNewReleasesRequest = {
  auth_token: string
  query: {
    country: string
  }
}

export const getNewReleases = async (req: getNewReleasesRequest) => {
  spotifyApi.setAccessToken(req.auth_token)

  const {
    albums: { items },
  } = await spotifyApi.getNewReleases({
    limit: 20,
    offset: 0,
    country: req.query.country,
  })

  return items
}

type getSongsByBpmRequest = {
  auth_token: string
  query: {
    country: string
    min: string
    max: string
  }
}

export const getSongsByBpm = async (req: getSongsByBpmRequest) => {
  spotifyApi.setAccessToken(req.auth_token)

  const trackIds = await getTrackIdsOfNewAlbums(req.query.country)
  const tracks = await getTracksWithAnalyses(trackIds)

  const filteredTracks = getTracksByBpm(
    parseInt(req.query.min),
    parseInt(req.query.max),
    tracks
  )

  return filteredTracks
}
