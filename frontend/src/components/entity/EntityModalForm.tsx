import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FieldConfig } from '../../types/entity';

interface EntityModalFormProps {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  initialValues: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export function EntityModalForm({ open, title, fields, initialValues, onClose, onSubmit }: EntityModalFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setApiError('');
  }, [initialValues, open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    firstInputRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const requiredFields = useMemo(() => fields.filter((f) => f.required), [fields]);

  function validate() {
    const nextErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const value = values[field.key];
      if (value === undefined || value === null || String(value).trim() === '') {
        nextErrors[field.key] = 'Campo obrigatório';
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Erro ao salvar registro');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          {fields.map((field, index) => (
            <label key={field.key} className="field-label">
              <span>{field.label} {field.required ? '*' : ''}</span>
              {field.type === 'select' ? (
                <select
                  value={String(values[field.key] ?? '')}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                >
                  <option value="">Selecione</option>
                  {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : (
                <input
                  ref={index === 0 ? firstInputRef : null}
                  type={field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.placeholder}
                  value={String(values[field.key] ?? '')}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                    }))
                  }
                />
              )}
              {errors[field.key] && <small className="error">{errors[field.key]}</small>}
            </label>
          ))}
          {apiError && <p className="error">{apiError}</p>}
          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
