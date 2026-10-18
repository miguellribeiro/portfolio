import { useSyncExternalStore } from 'react';
import { site } from './content.js';

/**
 * Região de preços (site.json → pricing.regions), independente do idioma da interface.
 * Ordem: escolha manual (localStorage) > região em navigator.languages (countries)
 * > idioma sem região (languages) > pricing.defaultRegion.
 */
const KEY = 'portfolio.region';
const regions = () => site.pricing?.regions || [];
const byId = (id) => regions().find((r) => r.id === id);

/** Resolve uma lista de tags BCP-47 (ex.: ["es-MX", "en"]) para o id da região. */
export function detectRegion(tags) {
  const list = regions();
  for (const tag of tags || []) {
    const [lang, ...rest] = String(tag).split('-');
    const sub = rest.find((x) => /^([A-Za-z]{2}|\d{3})$/.test(x));
    if (sub) {
      const r = list.find((x) => x.countries?.includes(sub.toUpperCase()));
      if (r) return r.id;
    }
    const r = list.find((x) => x.languages?.includes(lang.toLowerCase()));
    if (r) return r.id;
  }
  return site.pricing?.defaultRegion || list[0]?.id;
}

let current;
const listeners = new Set();
function init() {
  if (current) return current;
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch { /* modo privado */ }
  current = byId(saved)?.id || detectRegion(typeof navigator !== 'undefined' ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : []);
  return current;
}

export function setRegion(id) {
  if (!byId(id)) return;
  current = id;
  try { localStorage.setItem(KEY, id); } catch { /* modo privado */ }
  listeners.forEach((l) => l());
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };

/** @returns {[import('./types.js').Region, (id: string) => void]} */
export function useRegion() {
  const id = useSyncExternalStore(subscribe, init, init);
  return [byId(id) || regions()[0], setRegion];
}

/** Formata no locale da região, sem casas decimais. */
export function formatMoney(region, value, currency = region.currency, decimals = 0) {
  return new Intl.NumberFormat(region.locale, { style: 'currency', currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

/** Preço mensal de um plano (categoria.priceKey + plano.id) na região. */
export function regionPrice(region, cat, plan) {
  const v = region?.[cat.priceKey || cat.id]?.[plan.id];
  return typeof v === 'number' ? { value: v, text: formatMoney(region, v) } : null;
}

/** Valor da taxa de domínio da região, formatado (ou null). */
export function domainFeeText(region) {
  const f = region?.domainFee;
  if (!f || typeof f.amount !== 'number') return null;
  const decimals = Number.isInteger(f.amount) ? 0 : 2;
  return formatMoney(region, f.amount, f.currency || region.currency, decimals);
}

/**
 * Substitui {domainClause} por plans.domainClause com {fee} = taxa da região.
 * Região sem domainFee: a frase da taxa é omitida.
 */
export function withDomainFee(text, region, t) {
  if (!text.includes('{domainClause}')) return text;
  const fee = domainFeeText(region);
  const clause = fee ? t('plans.domainClause').replace('{fee}', fee) : '';
  return text.replace('{domainClause}', clause).replace(/\s{2,}/g, ' ').trim();
}
