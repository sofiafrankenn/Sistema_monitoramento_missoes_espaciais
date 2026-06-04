import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission } from '../../context/MissionContext';
import { T } from '../../theme';

function SensorCard({ icon, title, value, unit, description, status }) {
  const c  = status === 'critical' ? T.critical : status === 'warning' ? T.warn : T.ok;
  const bg = status === 'critical' ? T.criticalBg : status === 'warning' ? T.warnBg : T.okBg;
  const label = status === 'critical' ? 'CRÍTICO' : status === 'warning' ? 'ATENÇÃO' : 'NORMAL';
  return (
    <View style={[styles.card, { borderLeftColor: c }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDesc}>{description}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.cardValue, { color: c }]}>{value}</Text>
          <Text style={styles.cardUnit}>{unit}</Text>
        </View>
      </View>
      <View style={[styles.badge, { backgroundColor: bg, borderColor: c + '66' }]}>
        <Text style={[styles.badgeText, { color: c }]}>{label}</Text>
      </View>
    </View>
  );
}

function getStatus(value, warnThreshold, critThreshold, inverted = false) {
  if (inverted) {
    if (value > warnThreshold) return 'critical';
    if (value > critThreshold) return 'warning';
    return 'ok';
  }
  if (value < critThreshold) return 'critical';
  if (value < warnThreshold) return 'warning';
  return 'ok';
}

export default function SensorsScreen() {
  const { sensors, mission } = useMission();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DIAGNÓSTICO DE SISTEMAS</Text>
          <Text style={styles.title}>PAINEL DE SENSORES</Text>
          <View style={styles.line} />
        </View>

        <SensorCard icon="⚡" title="Energia do Sistema"   value={sensors.energy}    unit="%" description="Células solares + bateria de reserva"    status={getStatus(sensors.energy, 40, 20)} />
        <SensorCard icon="📶" title="Comunicação"          value={sensors.communication} unit="%" description="Link com a central em Terra"           status={getStatus(sensors.communication, 40, 30)} />
        <SensorCard icon="🌀" title="Estabilidade Orbital" value={sensors.orbitalStability} unit="%" description="Correção de trajetória e altitude"  status={getStatus(sensors.orbitalStability, 40, 25)} />
        <SensorCard icon="💨" title="Nível de Oxigênio"   value={sensors.oxygenLevel} unit="%" description="Sistema de suporte de vida"               status={getStatus(sensors.oxygenLevel, 40, 25)} />
        <SensorCard icon="🛢️" title="Combustível"         value={Number(sensors.fuelLevel).toFixed(1)} unit="%" description="Propelente para manobras orbitais" status={getStatus(sensors.fuelLevel, 30, 15)} />
        <SensorCard icon="🌡️" title="Temperatura"         value={sensors.temperature} unit="°C" description="Temperatura da cabine pressurizada"       status={sensors.temperature > 35 || sensors.temperature < -10 ? 'critical' : sensors.temperature > 28 ? 'warning' : 'ok'} />
        <SensorCard icon="☢️" title="Radiação"             value={sensors.radiation}  unit="Sv/h" description="Exposição à radiação cósmica"          status={getStatus(sensors.radiation, 5, 8, true)} />
        <SensorCard icon="🚀" title="Velocidade Orbital"  value={Number(sensors.speed).toLocaleString('pt-BR')} unit="km/h" description="Velocidade relativa ao ponto de referência" status="ok" />

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>LEGENDA</Text>
          {[
            { color: T.ok,       label: 'Normal — dentro do esperado' },
            { color: T.warn,     label: 'Atenção — monitoramento recomendado' },
            { color: T.critical, label: 'Crítico — ação imediata necessária' },
          ].map(item => (
            <View key={item.label} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  scroll:    { padding: 18, paddingBottom: 36 },
  header:    { alignItems: 'center', marginBottom: 22 },
  eyebrow:   { color: T.textMuted, fontSize: 10, letterSpacing: 4, fontWeight: '700', marginBottom: 4 },
  title:     { color: T.textPrimary, fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  line:      { width: 40, height: 2, backgroundColor: T.accent, marginTop: 10, borderRadius: 1 },
  card: {
    backgroundColor: T.surface, borderRadius: 8, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: T.border, borderLeftWidth: 4,
  },
  cardTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardIcon:  { fontSize: 26 },
  cardTitle: { color: T.textPrimary, fontSize: 14, fontWeight: '800' },
  cardDesc:  { color: T.textMuted, fontSize: 11, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  cardValue: { fontSize: 24, fontWeight: '900' },
  cardUnit:  { color: T.textMuted, fontSize: 11, marginTop: 2 },
  badge:     { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  legend:    { backgroundColor: T.surface, borderRadius: 8, padding: 14, marginTop: 6, borderWidth: 1, borderColor: T.border },
  legendTitle:{ color: T.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText:{ color: T.textSecondary, fontSize: 12 },
});
