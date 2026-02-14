document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // 3D Tilt Effect
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Online Order Logic
    const orderForm = document.getElementById('order-form');
    const totalPriceElement = document.getElementById('total-price');

    if (orderForm) {
        orderForm.addEventListener('change', updateTotal);
        orderForm.addEventListener('submit', handleOrderSubmit);
    }

    function updateTotal() {
        let total = 0;
        const checkboxes = document.querySelectorAll('.order-checkbox');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const price = parseFloat(checkbox.dataset.price);
                const quantityInput = document.querySelector(`input[name="qty-${checkbox.value}"]`);
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                total += price * quantity;
            }
        });

        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: ₹${total.toFixed(2)}`;
        }
    }

    function handleOrderSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('order-name').value;
        const totalText = totalPriceElement.textContent;

        alert(`Thank you, ${name}! Your order has been placed.\n${totalText}`);
        orderForm.reset();
        updateTotal();
    }
});
