from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the cards page
        page.goto("http://localhost:3000/cards")

        # Wait for the heading to be visible
        expect(page.get_by_role("heading", name="My Cards")).to_be_visible()

        # Check for the "no cards" message, which is expected for an unauthenticated user
        expect(page.get_by_text("No virtual cards found. Create one to get started!")).to_be_visible()

        # Take a screenshot for visual verification
        page.screenshot(path="verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()