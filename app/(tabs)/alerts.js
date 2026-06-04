import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission } from '../../context/MissionContext';
import { T } from '../../theme';

function AlertItem({ item }) {
  const c  = item.type === 'CRÍTICO' ? T.critical : item.type === 'AVISO' ? T.warn : T.accent;
  const bg = item.type === 'CRÍTICO' ? T.criticalBg : item.type === 'AVISO' ? T.warnBg : T.accentBg;
  const icon = item.type === 'CRÍTICO' ? '🆘' : item.type === 'AVISO' ? '⚠️' : 'ℹ️';
  const date = new Date(item.time);
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = date.toLocaleDateString('pt-BR');
  return (
    <View style={[styles.alertItem, { borderLeftColor: c }]}>
      <View style={styles.alertTop}>
        <View style={styles.alertLeft}>
          <Text style={styles.alertIcon}>{icon}</Text>
          <View style={[styles.typeBadge, { backgroundColor: bg, borderColor: c + '55' }]}>
            <Text style={[styles.typeText, { color: c }]}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.alertTime}>
          <Text style={styles.timeText}>{timeStr}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </View>
      <Text style={styles.alertMessage}>{item.message}</Text>
    </View>
  );
}

export default function AlertsScreen() {
  const { alerts, clearAlerts, addManualAlert } = useMission();
  const criticals = alerts.filter(a => a.type === 'CRÍTICO').length;
  const warnings  = alerts.filter(a => a.type === 'AVISO').length;
  const infos     = alerts.filter(a => a.type === 'INFO').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MONITORAMENTO</Text>
          <Text style={styles.title}>CENTRAL DE ALERTAS</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.summaryRow}>
          {[
            { num: criticals, label: 'Críticos',     color: T.critical, bg: T.criticalBg },
            { num: warnings,  label: 'Avisos',       color: T.warn,     bg: T.warnBg },
            { num: infos,     label: 'Informativos', color: T.accent,   bg: T.accentBg },
          ].map(item => (
            <View key={item.label} style={[styles.summaryCard, { backgroundColor: item.bg, borderColor: item.color + '55' }]}>
              <Text style={[styles.summaryNum, { color: item.color }]}>{item.num}</Text>
              <Text style={[styles.summaryLabel, { color: item.color }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => addManualAlert('Verificação de rotina dos sistemas', 'INFO')}>
            <Text style={styles.btnSecondaryText}>+ Alerta Teste</Text>
          </TouchableOpacity>
          {alerts.length > 0 && (
            <TouchableOpacity style={styles.btnDanger} onPress={() => Alert.alert('Limpar Alertas', 'Confirmar?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Limpar', style: 'destructive', onPress: clearAlerts }])}>
              <Text style={styles.btnDangerText}>Limpar Todos</Text>
            </TouchableOpacity>
          )}
        </View>

        {alerts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>Sem alertas ativos</Text>
            <Text style={styles.emptyDesc}>Todos os sistemas operando normalmente</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>HISTÓRICO ({alerts.length})</Text>
            {alerts.map(item => <AlertItem key={item.id} item={item} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: T.bg },
  scroll:       { padding: 18, paddingBottom: 36 },
  header:       { alignItems: 'center', marginBottom: 22 },
  eyebrow:      { color: T.textMuted, fontSize: 10, letterSpacing: 4, fontWeight: '700', marginBottom: 4 },
  title:        { color: T.textPrimary, fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  line:         { width: 40, height: 2, backgroundColor: T.accent, marginTop: 10, borderRadius: 1 },
  summaryRow:   { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryCard:  { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1 },
  summaryNum:   { fontSize: 26, fontWeight: '900' },
  summaryLabel: { fontSize: 10, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  actionsRow:   { flexDirection: 'row', gap: 10, marginBottom: 20 },
  btnSecondary: { flex: 1, backgroundColor: T.surface, borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  btnSecondaryText: { color: T.accent, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  btnDanger:    { flex: 1, backgroundColor: T.criticalBg, borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: T.critical + '55' },
  btnDangerText:{ color: T.critical, fontWeight: '800', fontSize: 13 },
  empty:        { alignItems: 'center', paddingVertical: 50 },
  emptyIcon:    { fontSize: 44, marginBottom: 12 },
  emptyTitle:   { color: T.ok, fontSize: 17, fontWeight: '800' },
  emptyDesc:    { color: T.textMuted, fontSize: 13, marginTop: 6 },
  sectionTitle: { color: T.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  alertItem:    { backgroundColor: T.surface, borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4 },
  alertTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertIcon:    { fontSize: 16 },
  typeBadge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1 },
  typeText:     { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  alertTime:    { alignItems: 'flex-end' },
  timeText:     { color: T.textSecondary, fontSize: 11, fontWeight: '600' },
  dateText:     { color: T.textMuted, fontSize: 10 },
  alertMessage: { color: T.textPrimary, fontSize: 13, lineHeight: 19 },
});
