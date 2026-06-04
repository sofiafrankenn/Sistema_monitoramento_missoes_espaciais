import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission } from '../../context/MissionContext';
import { T } from '../../theme';

function GaugeBar({ label, value, unit = '%' }) {
  const percent = Math.min(100, Math.max(0, value));
  const barColor = percent < 20 ? T.critical : percent < 40 ? T.warn : T.accent;
  return (
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeHeader}>
        <Text style={styles.gaugeLabel}>{label}</Text>
        <Text style={[styles.gaugeValue, { color: barColor }]}>{value}{unit}</Text>
      </View>
      <View style={styles.gaugeBg}>
        <View style={[styles.gaugeFill, { width: `${percent}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

function StatusCard({ title, value, icon, status }) {
  const c = status === 'ok' ? T.ok : status === 'warn' ? T.warn : T.critical;
  const bg = status === 'ok' ? T.okBg : status === 'warn' ? T.warnBg : T.criticalBg;
  return (
    <View style={[styles.statusCard, { borderTopColor: c }]}>
      <Text style={styles.statusIcon}>{icon}</Text>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={[styles.statusValue, { color: c }]}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { mission, sensors, alerts, loading } = useMission();
  if (loading) return <View style={styles.loading}><Text style={styles.loadingText}>Conectando...</Text></View>;

  const criticalAlerts = alerts.filter(a => a.type === 'CRÍTICO').length;
  const missionStatus = criticalAlerts > 2 ? 'CRÍTICO' : criticalAlerts > 0 ? 'ATENÇÃO' : 'NOMINAL';
  const statusColor = missionStatus === 'NOMINAL' ? T.ok : missionStatus === 'ATENÇÃO' ? T.warn : T.critical;
  const statusBg = missionStatus === 'NOMINAL' ? T.okBg : missionStatus === 'ATENÇÃO' ? T.warnBg : T.criticalBg;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>FIAP SPACE AGENCY</Text>
          <Text style={styles.headerTitle}>CENTRO DE CONTROLE</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Mission Banner */}
        <View style={[styles.banner, { borderColor: statusColor, backgroundColor: statusBg }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={styles.bannerMission}>{mission.name}</Text>
          </View>
          <Text style={[styles.bannerStatus, { color: statusColor }]}>{missionStatus}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatusCard title="Energia"    value={`${sensors.energy}%`}      icon="⚡" status={sensors.energy > 40 ? 'ok' : sensors.energy > 20 ? 'warn' : 'critical'} />
          <StatusCard title="O₂"         value={`${sensors.oxygenLevel}%`} icon="💨" status={sensors.oxygenLevel > 40 ? 'ok' : sensors.oxygenLevel > 25 ? 'warn' : 'critical'} />
          <StatusCard title="Alertas"    value={`${alerts.length}`}         icon="🚨" status={criticalAlerts === 0 ? 'ok' : criticalAlerts < 3 ? 'warn' : 'critical'} />
          <StatusCard title="Tripulação" value={`${mission.crew}`}          icon="👨‍🚀" status="ok" />
        </View>

        {/* Telemetria */}
        <Text style={styles.sectionTitle}>TELEMETRIA EM TEMPO REAL</Text>
        <View style={styles.card}>
          <GaugeBar label="Energia do Sistema"    value={sensors.energy} />
          <GaugeBar label="Comunicação"           value={sensors.communication} />
          <GaugeBar label="Estabilidade Orbital"  value={sensors.orbitalStability} />
          <GaugeBar label="Nível de Oxigênio"     value={sensors.oxygenLevel} />
          <GaugeBar label="Combustível"           value={Number(sensors.fuelLevel).toFixed(1)} />
        </View>

        {/* Info grid */}
        <Text style={styles.sectionTitle}>INFORMAÇÕES DA MISSÃO</Text>
        <View style={styles.infoGrid}>
          {[
            { label: 'Destino',      value: mission.destination },
            { label: 'Dias em órbita', value: String(mission.daysInOrbit) },
            { label: 'Temperatura',  value: `${sensors.temperature}°C` },
            { label: 'Velocidade',   value: `${Number(sensors.speed).toLocaleString()} km/h` },
            { label: 'Radiação',     value: `${sensors.radiation} Sv` },
            { label: 'Status',       value: mission.status },
          ].map(item => (
            <View key={item.label} style={styles.infoCard}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.hint}>Dados atualizados a cada 5 segundos</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: T.bg },
  scroll:       { padding: 18, paddingBottom: 36 },
  loading:      { flex: 1, backgroundColor: T.bg, justifyContent: 'center', alignItems: 'center' },
  loadingText:  { color: T.accent, fontSize: 16, fontWeight: '600' },

  header:       { alignItems: 'center', marginBottom: 22 },
  headerEyebrow:{ color: T.textMuted, fontSize: 10, letterSpacing: 4, fontWeight: '700', marginBottom: 4 },
  headerTitle:  { color: T.textPrimary, fontSize: 24, fontWeight: '900', letterSpacing: 3 },
  headerLine:   { width: 40, height: 2, backgroundColor: T.accent, marginTop: 10, borderRadius: 1 },

  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 8, padding: 14, borderWidth: 1.5, marginBottom: 16,
  },
  dot:          { width: 8, height: 8, borderRadius: 4 },
  bannerMission:{ color: T.textPrimary, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  bannerStatus: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },

  statsRow:   { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statusCard: {
    flex: 1, backgroundColor: T.surface, borderRadius: 8, padding: 10,
    alignItems: 'center', borderWidth: 1, borderColor: T.border, borderTopWidth: 3,
  },
  statusIcon:   { fontSize: 18, marginBottom: 4 },
  statusTitle:  { color: T.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  statusValue:  { fontSize: 15, fontWeight: '900' },

  sectionTitle: { color: T.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 10 },
  card: {
    backgroundColor: T.surface, borderRadius: 8, padding: 16,
    marginBottom: 24, borderWidth: 1, borderColor: T.border,
  },

  gaugeContainer: { marginBottom: 14 },
  gaugeHeader:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  gaugeLabel:     { color: T.textSecondary, fontSize: 13, fontWeight: '600' },
  gaugeValue:     { fontSize: 13, fontWeight: '800' },
  gaugeBg:        { height: 5, backgroundColor: T.surfaceAlt, borderRadius: 3, overflow: 'hidden' },
  gaugeFill:      { height: '100%', borderRadius: 3 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  infoCard: {
    width: '47.5%', backgroundColor: T.surface, borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: T.border,
  },
  infoLabel: { color: T.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  infoValue: { color: T.textPrimary, fontSize: 15, fontWeight: '800' },
  hint:      { color: T.textMuted, fontSize: 10, textAlign: 'center', letterSpacing: 1 },
});
