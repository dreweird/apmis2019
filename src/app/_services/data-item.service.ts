import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Commodity {
    constructor(public id?: number, public name?: string, public category?: string, public imageSrc?: string) {
    }
}

@Injectable()
export class DataItemService {

    constructor(private http: HttpClient) {}

    private _selectedId = -1;

    getItem(name: string){
        const url = `http://localhost/apmis/api/data/read.php?get=getCommodity`;
        return this.http.post<any>(url, {name});
    }

    get3MosAgo(name: string, area: string){
        const url = `http://localhost/apmis/api/data/read.php?get=get3MonthsAgo`;
        return this.http.post<any>(url, {name, area});
    }

    saveData(item: any){
        const url = `http://localhost/apmis/api/data/read.php?get=saveData`;
        return this.http.post<any>(url, {item});
    }

    deleteData(id: number){
        const url = `http://localhost/apmis/api/data/read.php?get=deleteData`;
        return this.http.post<any>(url, {id});
    }



    getAllCommodity(): Commodity[] {
        return [
            { id: 1, name: "White Corn", category: "Corn", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/34305e0c-aabb-4a77-b20f-110488d7ac11/white-corn.png" },
            { id: 2, name: "Yellow Corn", category: "Corn", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/370b23f7-2110-436b-97f4-da32e4754b9f/yellow-corn.png" },
            { id: 3, name: "Premium Well-milled", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/61287380-d048-4226-8afe-557a554a5b93/rice-premium.jpg" },
            { id: 4, name: "Special Well-milled", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/264cba98-27e7-474e-8ebb-2174b3082980/rice-special.jpg" },
            { id: 5, name: "Ordinary Well-milled", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/b7e95b82-69a9-4730-991d-99689d523d79/rice-wm.jpg" },
            { id: 6, name: "NFA", category: "Rice", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/fcc53448-31c4-4ff7-866b-e05a398b6dc1/rice-nfa.jpg" },

            { id: 7, name: "Squash(Kalabasa)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/0557aae5-5ad8-4070-b35c-6eefe6b4af2b/squash.jpg" },
            { id: 8, name: "Taro(Gabi)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/d6c60b1f-6a8d-4569-95c7-f62264eeb1fb/gabi.jpg" },
            { id: 9, name: "Sweeet Potato(Kamote)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/c5af914b-1074-42fa-a75c-24eb7e174be7/kamote.jpg" },
            { id: 10, name: "Bottle Gourd(Upo)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/d3c23187-8dda-409e-9020-e80c95540956/upo.jpg" },
            { id: 11, name: "Turnip(Singkamas)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/00fcdcb8-ff1a-4244-9cb0-a391da9881a2/singkamas.jpg" },
            { id: 12, name: "Chayote(Sayote)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a2eb82be-8ec6-4879-9020-76e032dbb8b0/chayote.jpg" },
            { id: 13, name: "Potato(Patatas)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a04fe398-c55b-4b66-9281-e5b859c84386/patatas.jpg" },
            { id: 14, name: "Carrots", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a38e5395-fa1c-4339-a621-e641ad5e4462/carrots.jpg" },
            { id: 15, name: "Bitter Gourd(Ampalaya)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/39333c39-ce37-43b2-b85e-3c89430df257/ampalaya.jpg" },
            { id: 16, name: "Sponge Gourd(Patola)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/bbd15de2-1ba5-490b-a32a-abe4f449b2e2/patola.jpg" },
            { id: 17, name: "Eggplant(Talong)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/cc6cd95f-83d8-4de2-935f-c903912db475/talong.jpg" },
            { id: 18, name: "Ladies Finger(Okra)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a942da08-dfbc-4204-a234-0e5d001ddff9/okra.jpg" },
            { id: 19, name: "String Beans(Sitaw)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/b7eae0de-d5ed-483b-bb87-405c6b61101c/sitao.jpg" },
            { id: 20, name: "Baguio Beans", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/cc3d0692-3cd6-413a-b0cd-fdc594b02251/baguio_beans.jpg" },
            { id: 21, name: "Pechay Native", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/e2ed279a-6da3-497c-a9c3-ac5bf37a234a/pechay.jpg" },
            { id: 22, name: "Cabbage(Repolyo)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/bd474f00-5b31-4dff-8233-adf0c983c06f/cabbage.jpg" },
            { id: 23, name: "Tomato(Kamatis)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/ec1e874e-ce44-4190-9d7e-d11491453dd6/kamatis.jpg" },
            { id: 24, name: "Sweet Pepper(Atsal)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/0570b7a0-e5c3-4505-a7fe-8e0cec092de9/atsal.jpg" },
            { id: 25, name: "Cucumber(Pipino)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a7c4f235-103d-4ac9-bd70-24f6d7f7746c/pipino.jpg" },
            { id: 26, name: "Garlic(Bawang)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/e1636553-dbf1-4399-81d7-36fb641aac98/garlic.jpg" },
            { id: 27, name: "Ginger(Luya)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/82dd9071-952d-4ad6-aa19-0640d301be3d/ginger.jpg" },
            { id: 28, name: "Onion(Sibuyas)", category: "Vegetable", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/26234030-8c34-4539-8186-9d311d8b8b74/onion-red.jpg" },

            { id: 29, name: "Mango Carabao", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/7713bdc0-992c-4189-8f13-c72597566f52/mango.jpg" },
            { id: 30, name: "Red Lady (Papaya)", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/7eb4a67b-6c1f-40fe-95b2-479ac397754d/papaya.jpg" },
            { id: 31, name: "Pineapple (Pinya)", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/15013e12-5110-4d81-b092-1431ee49f6e9/pinya.jpg" },
            { id: 32, name: "Banana Lakatan", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/16306951-8aad-456f-b793-2205ede301cc/lakatan.jpg" },
            { id: 33, name: "Banana Latundan", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/3c946f3c-8b41-43b7-9795-9e4a41294ddc/latundan.JPG" },
            { id: 34, name: "Banana Saba", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/ed911a9c-f972-4938-964e-f26fb8cc1d47/saba.jpg" },
            { id: 35, name: "Banana Cardava", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/cabeea93-2b30-48cb-a5f8-1489ffe56307/cardava.jpg" },
            { id: 36, name: "Watermelon", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/f2f334be-12d1-4cb9-90d1-bc7877fbc8ef/watermelon.jpg" },
            { id: 37, name: "Calamansi", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/47cc3597-a428-4017-8250-8b8ad14ae3b0/calamansi.jpg" },
            { id: 38, name: "Coconut, whole nut", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/ea017aae-a54f-4d67-a987-f9e3f6f048ef/coconut.jpg" },
            { id: 39, name: "Mongo Green", category: "Fruits", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/d6336163-93f3-4451-ae6d-5e836357bcfa/mongo.jpg" },

            { id: 40, name: "Lapu-Lapu", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/ce066d6f-20a9-4201-b2fa-9d1e7a6edc47/lapu-lapu.jpg" },
            { id: 41, name: "Danggit", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/52702240-3ea6-473d-91ca-577ce17d5a37/danggit.jpg" },
            { id: 42, name: "Dalagang bukid", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/96cd5680-8b2a-4550-9a3d-64d8381e6bd1/dalagang-bukid.JPG" },
            { id: 43, name: "Panit (Yellow Fin)", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/2773b219-0659-40ca-a792-05181d986454/yellow-fin.jpg" },
            { id: 44, name: "Tamban", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/225740fb-072d-4c7f-8655-d2d72ea96a2b/tamban.jpg" },
            { id: 45, name: "Flying Fish (Bangsi)", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/60bf45af-8574-49d7-a4ab-27bdd57332e5/flying-fish.jpg" },
            { id: 46, name: "Tulingan (Pawayan)", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a727651d-ef90-4bac-b0ad-09e28c033439/tulingan.JPG" },
            { id: 47, name: "Talakitok", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/b3b9df54-44bf-41d3-8432-31a5e2726607/talakitok1.jpg" },
            { id: 48, name: "Salay-salay", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/c96912a0-837c-4635-bee7-54249b3088fe/saly-salay.jpg" },
            { id: 49, name: "Squid", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/117c3b6a-6898-4691-aa4d-506ca33d585b/squid.jpg" },
            { id: 50, name: "Espada Dewit", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/4a83b49a-a176-4a3d-8b8b-6d38eb4b4dd9/espada.jpg" },
            { id: 51, name: "Katambak", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/5e4d519b-563b-4899-a2ad-4c1f42688b3c/katambak.jpg" },
            { id: 52, name: "Mol-mol", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/410c704d-420d-449b-9c69-d44df9df2e5e/Parrot-fish.jpg" },
            { id: 53, name: "Maya-maya", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/2387ba6b-566d-4a97-a6ee-64b2eaf91d42/maya-maya.jpg" },
            { id: 54, name: "Galungong", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/e60e73c6-991e-4242-a5c7-858c97b7c1e7/galunggong.jpg" },
            { id: 55, name: "Dilis", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/f493c761-be52-4b40-a3a4-c87ac4263747/dilis.jpg" },
            { id: 56, name: "Bangus", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/a13fe84e-4af6-45a2-9572-955a838b4758/Milkfish.jpg" },
            { id: 57, name: "Tilapia", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/0a62de72-09bd-4296-a1aa-b9acab460ec4/tilapia.jpg" },
            { id: 58, name: "Shrimp (White marine)", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/523c78f0-b9c7-49df-819c-82c998e61f9e/shrimp.jpg" },
            { id: 59, name: "Crab Alimango", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/05bd848a-0be5-4d70-8a5e-15b920501673/alimango.jpg" },
            { id: 60, name: "Crab Lambay", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/4ccc3e82-7bf1-4f46-b239-ff900d522169/lambay.jpg" },
            { id: 61, name: "Prawn Sugpo", category: "Fishery", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/0ee6fe90-30dd-4273-af00-fa5c35db4060/prawn.jpg" },

            { id: 62, name: "Beef Lean Meat", category: "Livestock and Poultry", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/e209c1d7-158e-4de4-ad4e-d3f9800650ae/Lean-beef.png" },
            { id: 63, name: "Pork Lean Meat", category: "Livestock and Poultry", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/761f5505-ac25-4923-a2ac-ce4ec40b935c/pork-lean.jpg" },
            { id: 64, name: "Pork Pata", category: "Livestock and Poultry", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/2b184582-b8d3-42b6-9aaf-831d97478b4f/pata-front.jpg" },
            { id: 65, name: "Chicken, Fully dressed broiler", category: "Livestock and Poultry", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/79654d4c-05d9-404c-8b14-b39c37eebeb8/dresses-broiler.jpg" },
            { id: 66, name: "Chicken Native, live weight", category: "Livestock and Poultry", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/717adcff-2903-4888-a916-b1f47678bb74/chicken-native.jpg" },
            { id: 67, name: "Chicken egg, med", category: "Livestock and Poultry", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/0b4a8340-e590-40ac-9215-da90704328a7/chicken-egg.jpg" },

            { id: 68, name: "Sugar (brown)", category: "Groceries", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/6542276b-44ca-4922-9644-4b6f3fd3f117/sugar%20brown.jpg" },
            { id: 69, name: "Sugar (white)", category: "Groceries", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/09ee702a-39da-41d2-ae6d-6409debb2deb/sugar%20white.jpg" },
            { id: 70, name: "Salt (iodized)", category: "Groceries", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/ff2e40cd-55cc-4cad-8a65-c44cd5a83976/salt%20iodized.png" },
            { id: 71, name: "Cooking Oil (Ordinary)", category: "Groceries", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/448f8c6e-fae4-4821-94e6-3efedea024bb/oil%20ordinary.png" },
            { id: 72, name: "Cooking Oil (Minola)", category: "Groceries", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/1e4ac497-c549-4c13-9bb8-6e8226fa70cd/oil%20minola.jpg" },

            { id: 73, name: "Complete (14-14-14)", category: "Fertilizers", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/654719f7-2562-4554-8dee-fe4106163a8f/complete.jpg" },
            { id: 74, name: "Urea (46-0-0)", category: "Fertilizers", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/60dc9f1d-5b60-466b-8710-8947e67e6456/urea.jpeg" },
            { id: 75, name: "Ammonium Phospate (16-20-0)", category: "Fertilizers", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/d9c441f1-e431-4dcc-b3ea-527733fb99b2/ammonium%20phospate.jpg" },
            { id: 76, name: "Ammonium Sulfate (21-0-0)", category: "Fertilizers", imageSrc: "https://storage.googleapis.com/361ea200839a47ccaec65fa78d72f748/468adbd9-3a0f-41c1-9ba6-7364ced438c4/ammonium%20sulfate.jpg" },

        ];
    }
    

    setSelectedId(id: number) {
        if (id < this.getAllCommodity().length) {
            this._selectedId = id;
        }
    }

    getCommodity(id: number): Commodity {
        return this.getAllCommodity().filter(commodity => commodity.id === id)[0];
    }

    getSelected(): Commodity {
        return this._selectedId < 0 ? null : this.getCommodity(this._selectedId);
    }
}