
export class Commodity {
    constructor(public id?: number, public name?: string, public category?: string, public imageSrc?: string) {
    }
}
export const commodity: Commodity[] = [
    { id: 1, name: "White Corn", category: "Corn", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/34305e0c-aabb-4a77-b20f-110488d7ac11/white-corn.png" },
    { id: 2, name: "Yellow Corn", category: "Corn", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/370b23f7-2110-436b-97f4-da32e4754b9f/yellow-corn.png" },
    { id: 3, name: "Premium Well-milled", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/61287380-d048-4226-8afe-557a554a5b93/rice-premium.jpg" },
    { id: 4, name: "Special Well-milled", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/264cba98-27e7-474e-8ebb-2174b3082980/rice-special.jpg" },
    { id: 5, name: "Ordinary Well-milled", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/b7e95b82-69a9-4730-991d-99689d523d79/rice-wm.jpg" },
    { id: 6, name: "NFA", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/fcc53448-31c4-4ff7-866b-e05a398b6dc1/rice-nfa.jpg" },

];
