import { test, expect } from '@playwright/test';

test('Alfredo Chat - Happy Path (Value First Funnel)', async ({ page }) => {
    // 1. Go to page
    await page.goto('http://localhost:5173');

    // 2. Pre-Simulation: Select 'Imóvel'
    const btnImovel = page.locator('button', { hasText: 'Imóvel' });
    await btnImovel.click();
    // Expect visual selection
    await expect(btnImovel).toHaveClass(/selected/);

    // 3. Enter Value (200.000,00 default is placeholder, checking input)
    const input = page.locator('input[inputmode="numeric"]');
    await input.fill('30000000'); // 300.000,00

    // 4. Start
    await page.click('button:has-text("Iniciar Simulação")');

    // 5. Chat Interface should appear
    await expect(page.locator('#chat-container')).toBeVisible({ timeout: 10000 });

    // 6. Step 0: Confirm Value (Bot asks, User clicks "Sim")
    await expect(page.locator('text=Recebi sua solicitação')).toBeVisible();
    await page.click('button:has-text("✅ Sim, Bora lá")');

    // 7. Step 1: Goal (Morar/Investir)
    await expect(page.locator('text=Qual o objetivo principal?')).toBeVisible();
    await page.click('button:has-text("🏠 Morar")');

    // 8. Step 2: Urgency
    await expect(page.locator('text=Sobre pressa')).toBeVisible();
    await page.click('button:has-text("🔥 3-6 Meses")');

    // 9. Step 3: Lance (Do you have one?)
    await expect(page.locator('text=Você tem algum valor')).toBeVisible();
    await page.click('button:has-text("💰 Dinheiro")');

    // 10. Step 4: Lance Value
    await expect(page.locator('text=Qual o valor disponível?')).toBeVisible();
    const chatInput = page.locator('input[placeholder="R$ 0,00"]');
    await chatInput.fill('5000000'); // 50.000,00
    await page.click('button[type="submit"]');

    // 11. Step 5: Analysis & Strategy Modal (The "Value Moment")
    await expect(page.locator('text=Encontrei estas 3 rotas')).toBeVisible({ timeout: 10000 });
    // Modal should open automatically
    await expect(page.locator('h2:has-text("Estratégia")')).toBeVisible();

    // Confirm Strategy
    await page.click('button:has-text("Confirmar Estratégia")');
    await expect(page.locator('h2:has-text("Estratégia")')).not.toBeVisible();

    // 12. Contact Info (Name)
    await expect(page.locator('text=qual seu nome completo?')).toBeVisible();
    await page.locator('input[placeholder="Digite sua resposta..."]').fill('Vlad Tester');
    await page.click('button[type="submit"]');

    // 13. WhatsApp
    await expect(page.locator('text=Qual seu WhatsApp')).toBeVisible();
    await page.locator('input[type="tel"]').fill('(11) 99999-9999');
    await page.click('button[type="submit"]');

    // 14. Proposal Summary
    await expect(page.locator('text=Resumo da Proposta')).toBeVisible();
    await page.click('button:has-text("✅ Confirmar e Pagar")');

    // 15. Pix
    await expect(page.locator('text=Pagamento instantâneo')).toBeVisible();
    await page.click('button:has-text("Já paguei")');

    // 16. Docs
    await expect(page.locator('text=Tirar foto')).toBeVisible();
    await page.click('text=Tirar foto');
    // Wait for "Validando IA" -> "Confirmar Dados"
    await expect(page.locator('button:has-text("Confirmar Dados")')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Confirmar Dados")');

    // 17. Success
    await expect(page.locator('text=Bem-vindo ao Grupo!')).toBeVisible();
    await expect(page.locator('text=Hash de Transação')).toBeVisible();
});
