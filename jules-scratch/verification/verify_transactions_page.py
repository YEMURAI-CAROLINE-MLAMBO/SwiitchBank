from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()
    page.wait_for_url("http://localhost:3000/")

    page.goto("http://localhost:3000/transactions")
    page.wait_for_selector(".transaction-row")

    page.screenshot(path="jules-scratch/verification/transactions-page.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
