import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useRegion } from '../engine/region.js';
import ListSelect from './ListSelect.jsx';

/** Seletor de região/moeda dos planos ("Brasil · BRL"). Independe do idioma; escolha salva. */
export default function RegionSelect() {
  const { t } = useI18n();
  const [region, setRegion] = useRegion();
  const regions = site.pricing?.regions || [];
  if (regions.length < 2 || !region) return null;
  return (
    <ListSelect
      className="lsel--region"
      label={t('plans.region.label')}
      value={region.id}
      onChange={setRegion}
      buttonText={(o) => `${o.name} · ${o.label}`}
      options={regions.map((r) => ({ code: r.id, flag: r.flag || r.id, name: t(`plans.region.names.${r.id}`), label: r.currency }))}
    />
  );
}
