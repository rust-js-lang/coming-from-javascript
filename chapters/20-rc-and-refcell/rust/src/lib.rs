//! Chapter 20: `Rc` and `RefCell`. Sharing on purpose: `Rc` gives a value
//! several owners and counts them; `RefCell` lets them change it, checking
//! the borrowing rules while the program runs.

use std::cell::RefCell;
use std::rc::Rc;

/// The cart the page shares. Its items change through a shared reference,
/// so they're in a `RefCell`, which lends them mutably one borrow at a time.
struct Cart {
    items: RefCell<Vec<String>>,
}

/// The header holds the cart: one of its owners, by `Rc`.
struct Header {
    cart: Rc<Cart>,
}

impl Header {
    fn badge(&self) -> String {
        format!("{} items", self.cart.items.borrow().len())
    }
}

/// The checkout holds it too.
struct Checkout {
    cart: Rc<Cart>,
}

impl Checkout {
    /// Adds an item: `&self`, and the cart's items still change.
    fn add(&self, item: &str) {
        self.cart.items.borrow_mut().push(item.to_string());
    }
}

/// Each item added at the checkout, and the header's badge after each.
/// `Rc::clone` doesn't copy the cart: it adds an owner.
pub fn shop(items: &[String]) -> Vec<String> {
    let cart = Rc::new(Cart { items: RefCell::new(Vec::new()) });
    let header = Header { cart: Rc::clone(&cart) };
    let checkout = Checkout { cart: Rc::clone(&cart) };
    items
        .iter()
        .map(|item| {
            checkout.add(item);
            header.badge()
        })
        .collect()
}

/// How many own the cart once the page is made: the page's own `cart`, the
/// header and the checkout.
pub fn owners() -> usize {
    let cart = Rc::new(Cart { items: RefCell::new(Vec::new()) });
    let _header = Header { cart: Rc::clone(&cart) };
    let _checkout = Checkout { cart: Rc::clone(&cart) };
    Rc::strong_count(&cart)
}

/// Reads the cart while adding to it: the borrowing rule, broken where the
/// compiler can't see. `RefCell` catches it as the program runs, and panics.
pub fn read_while_adding() -> usize {
    let items = RefCell::new(vec!["tea".to_string()]);
    let reading = items.borrow();
    items.borrow_mut().push("cake".to_string());
    reading.len()
}
