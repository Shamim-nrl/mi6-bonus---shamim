const btnContainer = document.getElementById("btn-container")
const cardContainer = document.getElementById("card-container")
const errorElement = document.getElementById("error-element")
const sortBtn = document.getElementById("sort-btn")

let selectedCategory = 1000;
let sortByView = false;
sortBtn.addEventListener("click", () => {
    sortByView = true
    fetchDataByCategories(selectedCategory, sortByView)
})

const fetchCategories = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/videos/categories")
    const data = await res.json()
    const categories = data.data
    // console.log(categories)

    categories.forEach((card) => {
        const btn = document.createElement("button")
        btn.innerText = card.category
        btn.classList = (" category-btn btn  btn-ghost bg-slate-700 text-white text-lg")

        btn.addEventListener("click", () => {
            fetchDataByCategories(card.category_id)
            const allBtns = document.querySelectorAll(".category-btn")
            for (const allBtn of allBtns) {
                allBtn.classList.remove("bg-red-600")
            }
            btn.classList.add("bg-red-600")
        })


        btnContainer.appendChild(btn)



        // console.log(card);
    })
}

const fetchDataByCategories = async (categoryId, sortByView) => {




    selectedCategory = categoryId
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
    const data2 = await res.json()
    const video = data2.data
    if (sortByView) {
        video.sort((a, b) => {
            const totalViewFirst = a.others?.views;
            const totalViewSecond = b.others?.views;
            const totalViewFirstNumber = parseFloat(totalViewFirst.replace("k", "")) || 0;
            const totalViewSecondNumber = parseFloat(totalViewSecond.replace("k", "")) || 0;

            return totalViewSecondNumber - totalViewFirstNumber
        })
    }

    if (video.length === 0) {
        errorElement.classList.remove("hidden")
    } else {
        errorElement.classList.add("hidden")
    }

    cardContainer.innerHTML = ""

    video.forEach((newVideo) => {
        let verified = ""
        if (newVideo.authors[0].verified) {
            verified = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>`
        }      

       
        const div = document.createElement("div")
        div.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full h-full" src="${newVideo.thumbnail}" alt="Shoes" />
                    <h6 class="absolute bottom-[40%] right-12">${newVideo.others.posted_date}: secend</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src="${newVideo.authors[0].profile_picture}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${newVideo.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${newVideo.authors[0].profile_name}</p>
                                ${verified}
                            </div>
                            <p class="mt-3">${newVideo.others.views}</p>
                        </div>
                    </div>
                </div>
            </div>
            `
        cardContainer.appendChild(div)


    })





}


fetchCategories()
fetchDataByCategories(selectedCategory, sortByView)


