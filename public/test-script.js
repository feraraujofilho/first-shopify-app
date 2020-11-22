const script = document.createElement("script");
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
script.type = "text/javascript"
script.onreadystatechange = handler
script.onload = handler
document.getElementsByTagName("head")[0].appendChild(script)


function handler() {
    const body = $(".shopify-section-feature-row");

    body.css({
        "position": "relative"
    })

    const shop = Shopify.shop

    const makeApp = products => {
        const bestSellerContainer = $(
            `<div>
                <h3>Our Best Sellers</h3>
                ${products.map(item => {
                return `
                <a href="/products/${item.handle}">
                    <p>${item.title}</p>
                </a>
                    `
            }).join("")
            }
            </div>`
        )
            .css({
                'position': 'fixed',
                'background-color': "#ffffff",
                'border': '1px solid black',
                'bottom': '80px',
                'right': '25px',
                'height': '400px',
                'width': '350px',
                'display': 'none'
            })

        const bestSellerButton = $('<img />').attr('src', 'https://www.pinclipart.com/picdir/middle/11-110022_button-the-lies-we-believe-rounded-rectangle-button.png').css({
            'position': 'fixed',
            'width': '150px',
            'bottom': '20px',
            'right': '20px',
            'cursor': 'pointer'
        })

        body.append(bestSellerButton)
        body.append(bestSellerContainer)

        bestSellerButton.click(() => {
            bestSellerContainer.slideToggle();
        })
    }

    fetch("https://cors-anywhere.herokuapp.com/https://f2bcbb374c5b.ngrok.io/api/products?shop=https://fernando-amazing-store.myshopify.com/")
        .then(res => res.json())
        .then(data => {
            makeApp(data.data)
        })
        .catch(err => {
            console.log(err)
        })
}

console.log("this is coming from script tag api!!!");

