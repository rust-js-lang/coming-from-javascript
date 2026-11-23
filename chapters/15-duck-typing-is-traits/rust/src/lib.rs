//! Chapter 15: duck typing is traits. A trait names what a type can do; a
//! type can do it only where an `impl` says so, every method there, and
//! the compiler checks before anything is sent.

/// What a notifier can do. `preview` has a body: every notifier gets it
/// for free, and may write its own.
pub trait Notifier {
    fn channel(&self) -> String;
    fn send(&self, message: &str) -> String;
    fn preview(&self, message: &str) -> String {
        format!("{}: {}", self.channel(), message.chars().take(10).collect::<String>())
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct Email {
    pub address: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Sms {
    pub number: String,
}

impl Notifier for Email {
    fn channel(&self) -> String {
        "email".to_string()
    }
    fn send(&self, message: &str) -> String {
        format!("emailed {}: {message}", self.address)
    }
}

impl Notifier for Sms {
    fn channel(&self) -> String {
        "sms".to_string()
    }
    fn send(&self, message: &str) -> String {
        let short: String = message.chars().take(20).collect();
        format!("texted {}: {short}", self.number)
    }
    // Its own preview, in place of the one it would get.
    fn preview(&self, _message: &str) -> String {
        format!("sms to {}", self.number)
    }
}

/// Sends by one notifier, whichever type it is: a generic, the type known
/// at each call.
pub fn notify(to: &impl Notifier, message: &str) -> String {
    to.send(message)
}

/// Sends the message by every notifier, emails and texts in one list:
/// `dyn Notifier` is "some notifier", each knowing its own methods.
pub fn broadcast(emails: &[Email], phones: &[Sms], message: &str) -> Vec<String> {
    let mut notifiers: Vec<Box<dyn Notifier>> = Vec::new();
    for email in emails {
        notifiers.push(Box::new(email.clone()));
    }
    for phone in phones {
        notifiers.push(Box::new(phone.clone()));
    }
    notifiers.iter().map(|n| n.send(message)).collect()
}

/// Each notifier's preview of the message.
pub fn previews(emails: &[Email], phones: &[Sms], message: &str) -> Vec<String> {
    let mut all: Vec<String> = emails.iter().map(|e| e.preview(message)).collect();
    all.extend(phones.iter().map(|p| p.preview(message)));
    all
}
