import {environment} from '../../../environments/environment'

export const ENDPOINTS = {
    GET_ALL_PLAY_URL:environment.serverUrl+environment.allPlayUrl,
    GET_PREDICTION_PLAY_URL:environment.serverUrl+environment.getPrediction,
    GET_HISTORICAL_MATCHES_URL:environment.serverUrl + environment.historicalMatchUrl,
    GET_STRATEGY:environment.serverUrl + environment.strategyUrl,
    SAVE_STRATEGY: environment.serverUrl + environment.strategyUrl,
    GET_STARTUP: environment.serverUrl + environment.startupUrl,
    GET_FAVOURITE: environment.serverUrl + environment.favouriteUrl,
    GET_LAYOUT: environment.serverUrl + environment.layoutUrl
}
