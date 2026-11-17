import { test, expect } from '@playwright/test';
import { siteURL } from './site';

test('studio: máximos são validados pelo handler, inclusive valores programáticos', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(await siteURL(page, 'studio', 4174));
  await expect(page.getByRole('button', { name: 'Preparar mensagem' })).toBeEnabled();
  const valid = { name: 'Pessoa de teste', email: 'teste@example.com', message: 'Quero construir um site.' };
  for (const [field, maximum] of [['name', 100], ['email', 254], ['message', 2000]] as const) {
    await page.locator('form').evaluate((form, values) => {
      for (const [key, value] of Object.entries(values)) {
        (form.querySelector('[name="' + key + '"]') as HTMLInputElement).value = value;
      }
    }, { ...valid, [field]: 'x'.repeat(maximum + 1) });
    await page.getByRole('button', { name: 'Preparar mensagem' }).click();
    const input = page.locator('[name="' + field + '"]');
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Use no máximo ' + maximum + ' caracteres ' + (field === 'message' ? 'na mensagem.' : field === 'email' ? 'no e-mail.' : 'no nome.'));
    await expect(page.locator('[aria-invalid=true]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Abrir mensagem no e-mail' })).toHaveCount(0);
  }
  const boundary = { name: 'n'.repeat(100), email: 'a@' + 'b'.repeat(248) + '.com', message: 'm'.repeat(2000) };
  await page.locator('form').evaluate((form, values) => {
    for (const [key, value] of Object.entries(values)) (form.querySelector('[name="' + key + '"]') as HTMLInputElement).value = value;
  }, boundary);
  await page.getByRole('button', { name: 'Preparar mensagem' }).click();
  await expect(page.getByRole('link', { name: 'Abrir mensagem no e-mail' })).toHaveAttribute('href', /body=/);
  await expect(page.locator('[aria-invalid=true]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('studio: Unicode malformado no FormData gera erro associado e foco sem URIError', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(await siteURL(page, 'studio', 4174));
  await page.getByLabel('Seu nome').fill('Pessoa de teste');
  await page.getByLabel('Seu e-mail').fill('teste@example.com');
  await page.getByLabel('O que você quer construir?').fill('Quero construir um site.');
  // Native FormData normalizes USVStrings. Inject malformed UTF-16 at its read
  // boundary to exercise the defensive path independently of that normalization.
  for (const field of ['name', 'email', 'message'] as const) {
    for (const units of [[0xd800], [0xdc00], [0xd83d, 0xde00, 0xd800], [0xdc00, 0xd800]]) {
      await page.evaluate(({ field, units }) => {
        const NativeFormData = window.FormData;
        window.FormData = class extends NativeFormData {
          get(key: string) { return key === field ? 'Texto inválido ' + String.fromCharCode(...units) : super.get(key); }
        };
        try { document.querySelector('form')!.requestSubmit(); }
        finally { window.FormData = NativeFormData; }
      }, { field, units });
      const input = page.locator('[name="' + field + '"]');
      await expect(input).toBeFocused();
      await expect(input).toHaveAccessibleDescription('Há um caractere inválido neste campo. Apague e digite o texto novamente.');
      await expect(page.locator('[aria-invalid=true]')).toHaveCount(1);
      await expect(page.getByRole('link', { name: 'Abrir mensagem no e-mail' })).toHaveCount(0);
    }
  }
  await testInfo.attach('unicode-error-form', { body: await page.locator('form').ariaSnapshot(), contentType: 'text/plain' });
  await page.getByLabel('Seu nome').fill('João 😀 李');
  await page.getByLabel('O que você quer construir?').fill('Olá! Quero um site 😀 العربية 中文 &subject=outro\r\nSem envio automático.');
  await page.getByRole('button', { name: 'Preparar mensagem' }).click();
  const href = await page.getByRole('link', { name: 'Abrir mensagem no e-mail' }).getAttribute('href');
  const draft = new URL(href!);
  expect(draft.protocol).toBe('mailto:');
  expect(draft.searchParams.get('subject')).toBe('Projeto para a Manpe Studio');
  expect(draft.searchParams.get('body')).toContain('João 😀 李');
  expect(draft.searchParams.get('body')).toContain('&subject=outro');
  expect([...draft.searchParams.keys()]).toEqual(['subject', 'body']);
  expect(errors).toEqual([]);
});

test('studio: FAQ descreve apenas o fluxo comprovável do contato', async ({ page }) => {
  await page.goto(await siteURL(page, 'studio', 4174));
  const summary = page.getByText('O que acontece com os dados do contato?', { exact: true });
  await summary.click();
  const answer = summary.locator('..');
  await expect(answer).toContainText('aplicativo de e-mail');
  await expect(answer).toContainText('WhatsApp');
  await expect(answer).toContainText('não realiza contratação nem pagamento');
  await expect(answer).not.toContainText(/ofuscação|criptografia|conformidade/);
});
