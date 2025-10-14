from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000/onboarding")

    # Onboarding - Welcome
    page.click('button:has-text("Connect Your Accounts")')

    # Onboarding - Connect Bank
    page.click('div.bank-card:has-text("Chase")')
    page.click('button:has-text("Continue")')

    # Wait for the dashboard to load by looking for the header
    page.wait_for_selector('h1:has-text("Dashboard")')

    # Take a screenshot of the dashboard
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
