import loadGoogleMapsAPI from 'load-google-maps-api'

let cachedGoogleMapsAPI: any = null

export default function loadGoogleMaps({ locale, apiKey }: { locale: string, apiKey: string}) {
    if (cachedGoogleMapsAPI) {
        return Promise.resolve(cachedGoogleMapsAPI)
    }

    return new Promise((resolve, reject) => {
        return loadGoogleMapsAPI({
            key: apiKey,
            language: locale,
            libraries: ['places']
        }).then((googleMaps:any) => {
            cachedGoogleMapsAPI = googleMaps
            return resolve(googleMaps)
        }).catch((error:any) => reject(error))
    })
}