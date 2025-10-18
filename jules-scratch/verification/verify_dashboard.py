from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/")

    # Onboarding
    page.wait_for_selector('.welcome-container')
    page.click('button:has-text("Get Started")')

    page.wait_for_selector('.connect-bank')
    page.click('.bank-card')
    page.click('button:has-text("Continue")')

    time.sleep(2)

    page.goto("http://localhost:3000/login")

    # Wait for the login form to be visible
    page.wait_for_selector('input[name="email"]')
    page.wait_for_selector('input[name="password"]')

    page.fill('input[name="email"]', 'test@example.com')
    page.fill('input[name="password"]', 'password')

    page.click('button[type="submit"]')

    # Wait for the dashboard to be visible
    page.wait_for_selector('.dashboard-container')

    page.screenshot(path="jules-scratch/verification/verification.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
