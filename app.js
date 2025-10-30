const products = [
    {id:1,title:"محصول شماره 1" , price:1000,img:"p1.jpg"},
    {id:2,title:"محصول شماره 2" , price:300,img:"p1.jpg"},
    {id:3,title:"محصول شماره 3" , price:3000,img:"p1.jpg"},
];

const CART_KEY = "shop_cart_v1";

function loadCart()
{
    const raw = localStorage.getItem(CART_KEY);
    return raw  ? JSON.parse(raw) : {};
}

function saveCart(cart)
{
    localStorage.setItem(CART_KEY,JSON.stringify(cart));
}

function addToCart(productId,qty=1)
{
    const cart = loadCart();
    if(cart[productId]) cart[productId] += qty; else cart[productId] = qty;
    saveCart(cart);
     renderCartCount();
     renderCartSidebar();
}

function removeFromCart(productId)
{
      const cart = loadCart();
      delete cart[productId];
      saveCart(cart);
       renderCartCount();
       renderCartSidebar();
}

function chanageQty(productId,qty)
{
    const cart = loadCart();
    if(qty <= 0) {
        delete cart[productId];
    }
    else {
        cart[productId] = qty;
    }
    saveCart(cart);
     renderCartCount();
     renderCartSidebar();
}

function calcTotal()
{
     const cart = loadCart();
     let total = 0;
     for(const id in cart)
     {
        const product = products.find(o => o.id == id);
        if(product) total += product.price * cart[id];
     }
     return total;
}

function renderProducts()
{
    const container = document.getElementById("productList");
    container.innerHTML = "";
    products.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card product-card shadow-sm">
                <img src="${p.img}" class="card-img-top product-img" />
                <div class="card-body">
                    <h5>${p.title}</h5>
                    <p class="card-text">قیمت : ${p.price.toLocaleString()} تومان</p>
                    <button class="btn btn-outline-success add-btn" data-id="${p.id}">افزودن به سبد خرید </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

     document.querySelectorAll(".add-btn").forEach(b => {
        b.addEventListener("click",e => {
            const id = e.currentTarget.dataset.id;
            addToCart(id,1)})
    });
}

function renderCartCount()
{
    const cart = loadCart();
    let count = 0;
    for(const id in cart) count += cart[id];
    document.getElementById("cartCount").textContent = count;
}

function setupCartToggle()
{
    const sidebar = document.getElementById("cartSidebar");
    const btn = document.getElementById("cartToggle");
    let open = false;
    btn.addEventListener("click",()=>{
        open = !open;
        sidebar.style.transform = open ? 'translateX(0)' : 'translateX(-105%)';
    });
}

function renderCartSidebar()
{
    const cart = loadCart();
    const container = document.getElementById("cartItems");
    container.innerHTML = "";
    for(const id in cart)
    {
        const p = products.find(o => o.id == id);
        if(!p) continue;
        const qty = cart[id];
        const row = document.createElement("div");
        row.className = "d-flex align-items-center mb-2";
        row.innerHTML = `
            <div class="flex-grow-1">
                <strong>${p.title}</strong>
                <div>${(p.price * qty).toLocaleString()} - ${qty}</div>
            </div>
            <div class="ms-2 d-flex flex-column align-items-center">
                <button class="btn btn-sm btn-outline-secondary btn-inc" data-id="${p.id}">+</button>
                <span>${qty}</span>
                <button class="btn btn-sm btn-outline-secondary btn-dec" data-id="${p.id}">-</button>
            </div>
        `;
        container.appendChild(row);
    }
    document.querySelectorAll(".btn-inc").forEach(b => {
        b.addEventListener("click",e => {const id = e.currentTarget.dataset.id;chanageQty(id,loadCart()[id] +1)})
    });
    document.querySelectorAll(".btn-dec").forEach(b => {
        b.addEventListener("click",e => {const id = e.currentTarget.dataset.id;chanageQty(id,loadCart()[id] -1)})
    });
}


window.addEventListener("DOMContentLoaded",()=>{
    renderProducts();
    renderCartCount();
    setupCartToggle();
    renderCartSidebar();
});