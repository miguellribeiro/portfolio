import { useEffect, useRef, useState, type FormEvent } from 'react';
import { email } from './content';

type Fields = 'name' | 'email' | 'message';
export default function ContactForm() {
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [draft, setDraft] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };
    const name = values.name.trim();
    const reply = values.email.trim();
    const message = values.message.trim();
    const next: Partial<Record<Fields, string>> = {};
    if (!name) next.name = 'Informe seu nome para identificar a conversa.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply)) next.email = 'Informe um e-mail válido, como nome@empresa.com.';
    if (message.length < 10) next.message = 'Conte um pouco mais sobre o projeto (ao menos 10 caracteres).';
    if (values.name.length > 100) next.name = 'Use no máximo 100 caracteres no nome.';
    if (values.email.length > 254) next.email = 'Use no máximo 254 caracteres no e-mail.';
    if (values.message.length > 2000) next.message = 'Use no máximo 2000 caracteres na mensagem.';
    for (const field of ['name', 'email', 'message'] as const) {
      // Remove valid surrogate pairs, then reject any remaining isolated surrogate.
      if (/[\uD800-\uDFFF]/.test(values[field].replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''))) {
        next[field] = 'Há um caractere inválido neste campo. Apague e digite o texto novamente.';
      }
    }
    setErrors(next);
    setDraft('');
    const first = (['name', 'email', 'message'] as const).find(key => next[key]);
    if (first) { formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${first}"]`)?.focus(); return; }
    setDraft(`mailto:${email}?subject=${encodeURIComponent('Projeto para a Manpe Studio')}&body=${encodeURIComponent(`Nome: ${name}\nE-mail: ${reply}\n\n${message}`)}`);
  }
  return <form ref={formRef} onSubmit={prepare} onChange={() => setDraft('')} noValidate>
    <fieldset disabled={!interactive}>
    <p className="muted">Prepare uma mensagem para enviar pelo seu aplicativo de e-mail. Você também pode usar o e-mail acima. Nenhum dado é enviado por este formulário.</p>
    <label htmlFor="contact-name">Seu nome</label>
    <input id="contact-name" name="name" autoComplete="name" required maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
    {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
    <label htmlFor="contact-email">Seu e-mail</label>
    <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
    {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
    <label htmlFor="contact-message">O que você quer construir?</label>
    <textarea id="contact-message" name="message" rows={5} required minLength={10} maxLength={2000} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />
    {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
    <div className="actions"><button className="button" type="submit">Preparar mensagem</button></div>
    <div aria-live="polite">{draft && <div className="status"><p>Mensagem preparada. Abra seu aplicativo de e-mail para revisar e enviar.</p><a href={draft}>Abrir mensagem no e-mail</a></div>}</div>
    </fieldset>
  </form>;
}
