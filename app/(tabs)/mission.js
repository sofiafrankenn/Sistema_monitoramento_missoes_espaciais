import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission } from '../../context/MissionContext';
import { useState, useEffect } from 'react';
import { T } from '../../theme';

const STATUS_OPTIONS = ['ACTIVE', 'STANDBY', 'EMERGENCY', 'COMPLETED'];
const STATUS_COLORS  = { ACTIVE: T.ok, STANDBY: T.accent, EMERGENCY: T.critical, COMPLETED: T.textMuted };

function FormField({ label, value, onChangeText, placeholder, error, keyboardType = 'default', required }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={T.textMuted}
        keyboardType={keyboardType}
        selectionColor={T.accent}
      />
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

function validate(form) {
  const e = {};
  if (!form.name.trim())          e.name = 'Nome da missão é obrigatório';
  else if (form.name.trim().length < 3) e.name = 'Mínimo 3 caracteres';
  if (!form.crew.trim())          e.crew = 'Obrigatório';
  else if (isNaN(form.crew) || parseInt(form.crew) < 1 || parseInt(form.crew) > 12) e.crew = 'Entre 1 e 12 membros';
  if (!form.destination.trim())   e.destination = 'Destino é obrigatório';
  if (!form.daysInOrbit.trim())   e.daysInOrbit = 'Obrigatório';
  else if (isNaN(form.daysInOrbit) || parseInt(form.daysInOrbit) < 0) e.daysInOrbit = 'Número inválido';
  if (!form.launchDate.trim())    e.launchDate = 'Obrigatório';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.launchDate)) e.launchDate = 'Formato: AAAA-MM-DD';
  return e;
}

export default function MissionScreen() {
  const { mission, updateMission } = useMission();
  const [form, setForm] = useState({ name: '', crew: '', destination: '', daysInOrbit: '', launchDate: '', status: 'ACTIVE' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ name: mission.name || '', crew: String(mission.crew || ''), destination: mission.destination || '', daysInOrbit: String(mission.daysInOrbit || ''), launchDate: mission.launchDate || '', status: mission.status || 'ACTIVE' });
  }, [mission]);

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: null }));
    setSaved(false);
  };

  const handleSave = async () => {
    const e = validate(form);
    if (Object.keys(e).length > 0) { setErrors(e); Alert.alert('Formulário inválido', 'Corrija os campos destacados.'); return; }
    await updateMission({ name: form.name.trim(), crew: parseInt(form.crew), destination: form.destination.trim(), daysInOrbit: parseInt(form.daysInOrbit), launchDate: form.launchDate.trim(), status: form.status });
    setSaved(true);
    Alert.alert('Salvo!', 'Dados da missão atualizados com sucesso.');
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>CONFIGURAÇÃO</Text>
            <Text style={styles.title}>DADOS DA MISSÃO</Text>
            <View style={styles.line} />
          </View>

          {errorCount > 0 && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠  {errorCount} campo{errorCount > 1 ? 's' : ''} com erro</Text>
            </View>
          )}
          {saved && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>✓  Dados salvos com sucesso</Text>
            </View>
          )}

          <View style={styles.card}>
            <FormField label="Nome da Missão"        value={form.name}        onChangeText={v => handleChange('name', v)}        placeholder="Ex: Apollo X-2026"      error={errors.name}        required />
            <FormField label="Tripulantes"            value={form.crew}        onChangeText={v => handleChange('crew', v)}        placeholder="1 a 12"                 error={errors.crew}        keyboardType="numeric" required />
            <FormField label="Destino"                value={form.destination} onChangeText={v => handleChange('destination', v)} placeholder="Ex: Estação Orbital L2"  error={errors.destination} required />
            <FormField label="Dias em Órbita"         value={form.daysInOrbit} onChangeText={v => handleChange('daysInOrbit', v)} placeholder="Ex: 14"                 error={errors.daysInOrbit} keyboardType="numeric" required />
            <FormField label="Data de Lançamento"     value={form.launchDate}  onChangeText={v => handleChange('launchDate', v)}  placeholder="AAAA-MM-DD"             error={errors.launchDate}  required />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Status da Missão <Text style={styles.required}>*</Text></Text>
              <View style={styles.statusOptions}>
                {STATUS_OPTIONS.map(opt => {
                  const selected = form.status === opt;
                  const c = STATUS_COLORS[opt];
                  return (
                    <TouchableOpacity key={opt} style={[styles.statusOption, selected && { borderColor: c, backgroundColor: c + '18' }]} onPress={() => handleChange('status', opt)}>
                      <Text style={[styles.statusOptionText, selected && { color: c }]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => { setForm({ name: mission.name, crew: String(mission.crew), destination: mission.destination, daysInOrbit: String(mission.daysInOrbit), launchDate: mission.launchDate, status: mission.status }); setErrors({}); setSaved(false); }}>
              <Text style={styles.btnSecondaryText}>Redefinir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnPrimaryText}>Salvar Missão</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: T.bg },
  scroll:       { padding: 18, paddingBottom: 40 },
  header:       { alignItems: 'center', marginBottom: 22 },
  eyebrow:      { color: T.textMuted, fontSize: 10, letterSpacing: 4, fontWeight: '700', marginBottom: 4 },
  title:        { color: T.textPrimary, fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  line:         { width: 40, height: 2, backgroundColor: T.accent, marginTop: 10, borderRadius: 1 },
  errorBanner:  { backgroundColor: T.criticalBg, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: T.critical + '55' },
  errorBannerText: { color: T.critical, fontSize: 13, fontWeight: '700' },
  successBanner:{ backgroundColor: T.okBg, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: T.ok + '55' },
  successBannerText: { color: T.ok, fontSize: 13, fontWeight: '700' },
  card:         { backgroundColor: T.surface, borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: T.border },
  fieldContainer: { marginBottom: 18 },
  label:        { color: T.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  required:     { color: T.critical },
  input:        { backgroundColor: T.surfaceAlt, borderRadius: 8, padding: 13, color: T.textPrimary, fontSize: 15, borderWidth: 1, borderColor: T.border },
  inputError:   { borderColor: T.critical },
  errorText:    { color: T.critical, fontSize: 12, marginTop: 5, fontWeight: '600' },
  statusOptions:{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  statusOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.surfaceAlt },
  statusOptionText: { color: T.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  buttonsRow:   { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btnSecondary: { flex: 1, backgroundColor: T.surface, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  btnSecondaryText: { color: T.textSecondary, fontWeight: '700', fontSize: 14 },
  btnPrimary:   { flex: 2, backgroundColor: T.accent, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnPrimaryText: { color: '#FFF8E7', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
});
