export type Lang = 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt';

type Keys =
  | 'title'
  | 'subtitle'
  | 'protection'
  | 'blockToggle'
  | 'identifyToggle'
  | 'lastUpdate'
  | 'update'
  | 'updateLoading'
  | 'reportsTitle'
  | 'reportsWeek'
  | 'reportHint'
  | 'noCalls'
  | 'reportButton'
  | 'checklistTitle'
  | 'checklistBody'
  | 'checklistPath'
  | 'paywallTitle'
  | 'paywallSubtitle'
  | 'paywallPrice'
  | 'benefitFast'
  | 'benefitPriority'
  | 'benefitReports'
  | 'benefitSync'
  | 'benefitAdFree'
  | 'ctaStart'
  | 'ctaRestore'
  | 'ctaClose'
  | 'entitlementActive'
  | 'entitlementInactive'
  | 'entitlementUpgrade'
  | 'reportNumber'
  | 'spamType'
  | 'spamTelemarketing'
  | 'spamSpam'
  | 'spamFraud'
  | 'spamOther'
  | 'submit'
  | 'gdprTitle'
  | 'gdprSummary'
  | 'gdprOpen'
  | 'gdprData'
  | 'gdprRights'
  | 'gdprContact'
  | 'smsInfo'
  | 'checklistOpenSettings';

const translations: Record<Lang, Record<Keys, string>> = {
  it: {
    title: 'CallShield',
    subtitle: 'Blocca spam, identifica chi chiama e raccogli segnalazioni.',
    protection: 'Protezione',
    blockToggle: 'Blocco numeri spam',
    identifyToggle: 'Identificazione chiamante',
    lastUpdate: 'Ultimo aggiornamento',
    update: 'Aggiorna',
    updateLoading: '...',
    reportsTitle: 'Segnalazioni',
    reportsWeek: 'Questa settimana:',
    reportHint: 'Invia segnalazioni per migliorare i punteggi di rischio condivisi.',
    noCalls: 'Nessuna chiamata recente da segnalare.',
    reportButton: 'Segnala',
    checklistTitle: 'Checklist iOS',
    checklistBody:
      'Aggiungi un Call Directory Extension in Xcode e richiama `CXCallDirectoryManager.reloadExtension()` dall’app per applicare la lista.',
    checklistPath: 'Percorso utente: Impostazioni › Telefono › Blocco e identificazione › abilita “CallShield”.',
    paywallTitle: 'CallShield Plus',
    paywallSubtitle: 'Più aggiornamenti, protezione prioritaria, zero pubblicità.',
    paywallPrice: '€0,99/mese',
    benefitFast: 'Aggiornamenti spam più frequenti',
    benefitPriority: 'Identificazione prioritaria',
    benefitReports: 'Report illimitati con maggior peso',
    benefitSync: 'Sincronizza la blocklist su tutti i device',
    benefitAdFree: 'Esperienza senza pubblicità',
    ctaStart: 'Attiva a €0,99/mese',
    ctaRestore: 'Ripristina acquisti',
    ctaClose: 'Continua senza Plus',
    entitlementActive: 'Plus attivo',
    entitlementInactive: 'Plus non attivo',
    entitlementUpgrade: 'Disponibile con Plus',
    reportNumber: 'Segnala numero',
    spamType: 'Tipo di spam',
    spamTelemarketing: 'Telemarketing',
    spamSpam: 'Spam',
    spamFraud: 'Frode',
    spamOther: 'Altro',
    submit: 'Invia',
    gdprTitle: 'Privacy & GDPR',
    gdprSummary: 'Come trattiamo i dati delle segnalazioni.',
    gdprOpen: 'Apri dettagli GDPR',
    gdprData: 'Dati trattati: numeri segnalati, etichette di spam, log tecnici minimi per protezione e debug.',
    gdprRights:
      'Puoi chiedere accesso o cancellazione delle segnalazioni associate al tuo dispositivo. Conserviamo le segnalazioni per prevenire abusi e migliorare la protezione.',
    gdprContact: 'Per richieste GDPR scrivi a privacy@callshield.app',
    smsInfo:
      'Per blocco/identificazione: abilita l’estensione CallShield in Impostazioni › Telefono › Blocco e identificazione. Per filtri SMS attiva in Impostazioni › Messaggi › Sconosciuti e spam.',
    checklistOpenSettings: 'Apri impostazioni Telefono',
  },
  en: {
    title: 'CallShield',
    subtitle: 'Block spam, identify callers, and collect reports.',
    protection: 'Protection',
    blockToggle: 'Block spam numbers',
    identifyToggle: 'Caller identification',
    lastUpdate: 'Last update',
    update: 'Refresh',
    updateLoading: '...',
    reportsTitle: 'Reports',
    reportsWeek: 'This week:',
    reportHint: 'Send reports to improve shared risk scores.',
    noCalls: 'No recent calls to report.',
    reportButton: 'Report',
    checklistTitle: 'iOS checklist',
    checklistBody:
      'Add a Call Directory Extension in Xcode and call `CXCallDirectoryManager.reloadExtension()` from the app to apply the list.',
    checklistPath: 'User path: Settings › Phone › Blocked & Identified Callers › enable “CallShield”.',
    paywallTitle: 'CallShield Plus',
    paywallSubtitle: 'Faster updates, priority protection, ad-free.',
    paywallPrice: '€0.99/month',
    benefitFast: 'More frequent spam updates',
    benefitPriority: 'Priority caller ID',
    benefitReports: 'Unlimited reports with higher weight',
    benefitSync: 'Sync your blocklist across devices',
    benefitAdFree: 'Ad-free experience',
    ctaStart: 'Start for €0.99/month',
    ctaRestore: 'Restore purchases',
    ctaClose: 'Continue without Plus',
    entitlementActive: 'Plus active',
    entitlementInactive: 'Plus not active',
    entitlementUpgrade: 'Available with Plus',
    reportNumber: 'Report number',
    spamType: 'Spam type',
    spamTelemarketing: 'Telemarketing',
    spamSpam: 'Spam',
    spamFraud: 'Fraud',
    spamOther: 'Other',
    submit: 'Submit',
    gdprTitle: 'Privacy & GDPR',
    gdprSummary: 'How we process report data.',
    gdprOpen: 'Open GDPR details',
    gdprData: 'Processed data: reported numbers, spam labels, minimal technical logs for protection and debugging.',
    gdprRights:
      'You can request access or deletion of reports tied to your device. Reports are kept to prevent abuse and improve protection.',
    gdprContact: 'For GDPR requests contact privacy@callshield.app',
    smsInfo:
      'To block/identify calls: enable the CallShield extension in Settings › Phone › Blocked & Identified Callers. For SMS filtering, enable in Settings › Messages › Unknown & Spam.',
    checklistOpenSettings: 'Open Phone settings',
  },
  es: {
    title: 'CallShield',
    subtitle: 'Bloquea spam, identifica quién llama y recoge reportes.',
    protection: 'Protección',
    blockToggle: 'Bloqueo de números spam',
    identifyToggle: 'Identificación de llamadas',
    lastUpdate: 'Última actualización',
    update: 'Actualizar',
    updateLoading: '...',
    reportsTitle: 'Reportes',
    reportsWeek: 'Esta semana:',
    reportHint: 'Envía reportes para mejorar las puntuaciones de riesgo compartidas.',
    noCalls: 'No hay llamadas recientes para reportar.',
    reportButton: 'Reportar',
    checklistTitle: 'Checklist iOS',
    checklistBody:
      'Agrega una extensión Call Directory en Xcode y llama `CXCallDirectoryManager.reloadExtension()` desde la app para aplicar la lista.',
    checklistPath: 'Ruta usuario: Ajustes › Teléfono › Bloqueo e identificación › habilita “CallShield”.',
    paywallTitle: 'CallShield Plus',
    paywallSubtitle: 'Actualizaciones más rápidas, protección prioritaria y sin anuncios.',
    paywallPrice: '€0,99/mes',
    benefitFast: 'Actualizaciones de spam más frecuentes',
    benefitPriority: 'Identificación prioritaria',
    benefitReports: 'Reportes ilimitados con mayor peso',
    benefitSync: 'Sincroniza tu lista de bloqueo en todos los dispositivos',
    benefitAdFree: 'Experiencia sin anuncios',
    ctaStart: 'Empieza por €0,99/mes',
    ctaRestore: 'Restaurar compras',
    ctaClose: 'Seguir sin Plus',
    entitlementActive: 'Plus activo',
    entitlementInactive: 'Plus no activo',
    entitlementUpgrade: 'Disponible con Plus',
    reportNumber: 'Reportar número',
    spamType: 'Tipo de spam',
    spamTelemarketing: 'Telemarketing',
    spamSpam: 'Spam',
    spamFraud: 'Fraude',
    spamOther: 'Otro',
    submit: 'Enviar',
    gdprTitle: 'Privacidad y RGPD',
    gdprSummary: 'Cómo tratamos los datos de los reportes.',
    gdprOpen: 'Abrir detalles RGPD',
    gdprData: 'Datos tratados: números reportados, etiquetas de spam y registros técnicos mínimos para protección y depuración.',
    gdprRights:
      'Puedes solicitar acceso o eliminación de los reportes vinculados a tu dispositivo. Los reportes se conservan para prevenir abusos y mejorar la protección.',
    gdprContact: 'Para solicitudes RGPD escribe a privacy@callshield.app',
    smsInfo:
      'Para bloquear/identificar llamadas: habilita la extensión CallShield en Ajustes › Teléfono › Bloqueo e identificación. Para filtrado SMS, habilita en Ajustes › Mensajes › Desconocidos y spam.',
    checklistOpenSettings: 'Abrir ajustes de Teléfono',
  },
  fr: {
    title: 'CallShield',
    subtitle: 'Bloquez le spam, identifiez qui appelle et collectez des signalements.',
    protection: 'Protection',
    blockToggle: 'Blocage des numéros spam',
    identifyToggle: "Identification de l’appelant",
    lastUpdate: 'Dernière mise à jour',
    update: 'Actualiser',
    updateLoading: '...',
    reportsTitle: 'Signalements',
    reportsWeek: 'Cette semaine :',
    reportHint: 'Envoyez des signalements pour améliorer les scores de risque partagés.',
    noCalls: 'Aucun appel récent à signaler.',
    reportButton: 'Signaler',
    checklistTitle: 'Checklist iOS',
    checklistBody:
      'Ajoutez une extension Call Directory dans Xcode et appelez `CXCallDirectoryManager.reloadExtension()` depuis l’app pour appliquer la liste.',
    checklistPath: 'Chemin utilisateur : Réglages › Téléphone › Blocage et identification › activez “CallShield”.',
    paywallTitle: 'CallShield Plus',
    paywallSubtitle: 'Mises à jour plus rapides, protection prioritaire, sans pub.',
    paywallPrice: '0,99 € / mois',
    benefitFast: 'Mises à jour spam plus fréquentes',
    benefitPriority: 'Identification prioritaire',
    benefitReports: 'Signalements illimités avec plus de poids',
    benefitSync: 'Synchronisez votre liste de blocage',
    benefitAdFree: 'Expérience sans publicité',
    ctaStart: 'Commencer pour 0,99 €/mois',
    ctaRestore: 'Restaurer les achats',
    ctaClose: 'Continuer sans Plus',
    entitlementActive: 'Plus actif',
    entitlementInactive: 'Plus inactif',
    entitlementUpgrade: 'Disponible avec Plus',
    reportNumber: 'Signaler un numéro',
    spamType: 'Type de spam',
    spamTelemarketing: 'Télémarketing',
    spamSpam: 'Spam',
    spamFraud: 'Fraude',
    spamOther: 'Autre',
    submit: 'Envoyer',
    gdprTitle: 'Confidentialité & RGPD',
    gdprSummary: 'Comment nous traitons les données des signalements.',
    gdprOpen: 'Ouvrir les détails RGPD',
    gdprData:
      'Données traitées : numéros signalés, libellés de spam, journaux techniques minimaux pour la protection et le debug.',
    gdprRights:
      'Vous pouvez demander l’accès ou la suppression des signalements liés à votre appareil. Les signalements sont conservés pour prévenir les abus et améliorer la protection.',
    gdprContact: 'Pour les demandes RGPD, écrivez à privacy@callshield.app',
    smsInfo:
      'Pour bloquer/identifier les appels : activez l’extension CallShield dans Réglages › Téléphone › Blocage et identification. Pour le filtrage SMS, activez dans Réglages › Messages › Expéditeurs inconnus et spam.',
    checklistOpenSettings: 'Ouvrir Réglages Téléphone',
  },
  de: {
    title: 'CallShield',
    subtitle: 'Blockiere Spam, erkenne Anrufer und sammle Meldungen.',
    protection: 'Schutz',
    blockToggle: 'Spam-Nummern blockieren',
    identifyToggle: 'Anruferkennung',
    lastUpdate: 'Letztes Update',
    update: 'Aktualisieren',
    updateLoading: '...',
    reportsTitle: 'Meldungen',
    reportsWeek: 'Diese Woche:',
    reportHint: 'Sende Meldungen, um die Risikobewertungen zu verbessern.',
    noCalls: 'Keine aktuellen Anrufe zu melden.',
    reportButton: 'Melden',
    checklistTitle: 'iOS-Checkliste',
    checklistBody:
      'Füge in Xcode eine Call Directory Extension hinzu und rufe `CXCallDirectoryManager.reloadExtension()` aus der App auf, um die Liste anzuwenden.',
    checklistPath: 'Pfad: Einstellungen › Telefon › Blockierte/identifizierte Anrufer › „CallShield“ aktivieren.',
    paywallTitle: 'CallShield Plus',
    paywallSubtitle: 'Schnellere Updates, Prioritätsschutz, werbefrei.',
    paywallPrice: '0,99 €/Monat',
    benefitFast: 'Häufigere Spam-Updates',
    benefitPriority: 'Priorisierte Anruferkennung',
    benefitReports: 'Unbegrenzte Meldungen mit höherem Gewicht',
    benefitSync: 'Synchronisiere deine Blockliste',
    benefitAdFree: 'Werbefreie Erfahrung',
    ctaStart: 'Start für 0,99 €/Monat',
    ctaRestore: 'Käufe wiederherstellen',
    ctaClose: 'Ohne Plus fortfahren',
    entitlementActive: 'Plus aktiv',
    entitlementInactive: 'Plus nicht aktiv',
    entitlementUpgrade: 'Verfügbar mit Plus',
    reportNumber: 'Nummer melden',
    spamType: 'Spam-Typ',
    spamTelemarketing: 'Telefonmarketing',
    spamSpam: 'Spam',
    spamFraud: 'Betrug',
    spamOther: 'Andere',
    submit: 'Senden',
    gdprTitle: 'Datenschutz & DSGVO',
    gdprSummary: 'Wie wir Meldedaten verarbeiten.',
    gdprOpen: 'DSGVO-Details öffnen',
    gdprData:
      'Verarbeitete Daten: gemeldete Nummern, Spam-Beschriftungen, minimale technische Logs für Schutz und Fehlersuche.',
    gdprRights:
      'Du kannst Zugriff oder Löschung der mit deinem Gerät verknüpften Meldungen anfordern. Meldungen werden zur Missbrauchsprävention und zur Verbesserung des Schutzes aufbewahrt.',
    gdprContact: 'Für DSGVO-Anfragen: privacy@callshield.app',
    smsInfo:
      'Zum Blockieren/Identifizieren: Aktivieren Sie die CallShield-Erweiterung unter Einstellungen › Telefon › Blockierte & identifizierte Anrufer. Für SMS-Filter unter Einstellungen › Nachrichten › Unbekannte Absender & Spam aktivieren.',
    checklistOpenSettings: 'Telefon-Einstellungen öffnen',
  },
  pt: {
    title: 'CallShield',
    subtitle: 'Bloqueie spam, identifique quem liga e colete denúncias.',
    protection: 'Proteção',
    blockToggle: 'Bloqueio de números spam',
    identifyToggle: 'Identificação de chamadas',
    lastUpdate: 'Última atualização',
    update: 'Atualizar',
    updateLoading: '...',
    reportsTitle: 'Denúncias',
    reportsWeek: 'Esta semana:',
    reportHint: 'Envie denúncias para melhorar as pontuações de risco.',
    noCalls: 'Nenhuma chamada recente para denunciar.',
    reportButton: 'Denunciar',
    checklistTitle: 'Checklist iOS',
    checklistBody:
      'Adicione uma Call Directory Extension no Xcode e chame `CXCallDirectoryManager.reloadExtension()` no app para aplicar a lista.',
    checklistPath: 'Caminho: Ajustes › Telefone › Bloqueio e identificação › ative “CallShield”.',
    paywallTitle: 'CallShield Plus',
    paywallSubtitle: 'Atualizações mais rápidas, proteção prioritária, sem anúncios.',
    paywallPrice: '€0,99/mês',
    benefitFast: 'Atualizações de spam mais frequentes',
    benefitPriority: 'Identificação prioritária',
    benefitReports: 'Denúncias ilimitadas com mais peso',
    benefitSync: 'Sincronize sua lista de bloqueio',
    benefitAdFree: 'Experiência sem anúncios',
    ctaStart: 'Começar por €0,99/mês',
    ctaRestore: 'Restaurar compras',
    ctaClose: 'Continuar sem Plus',
    entitlementActive: 'Plus ativo',
    entitlementInactive: 'Plus inativo',
    entitlementUpgrade: 'Disponível com Plus',
    reportNumber: 'Denunciar número',
    spamType: 'Tipo de spam',
    spamTelemarketing: 'Telemarketing',
    spamSpam: 'Spam',
    spamFraud: 'Fraude',
    spamOther: 'Outro',
    submit: 'Enviar',
    gdprTitle: 'Privacidade e RGPD',
    gdprSummary: 'Como tratamos os dados das denúncias.',
    gdprOpen: 'Abrir detalhes RGPD',
    gdprData:
      'Dados tratados: números denunciados, etiquetas de spam e logs técnicos mínimos para proteção e depuração.',
    gdprRights:
      'Você pode solicitar acesso ou exclusão das denúncias vinculadas ao seu dispositivo. As denúncias são mantidas para prevenir abuso e melhorar a proteção.',
    gdprContact: 'Para pedidos RGPD escreva para privacy@callshield.app',
    smsInfo:
      'Para bloquear/identificar chamadas: ative a extensão CallShield em Ajustes › Telefone › Bloqueio e identificação. Para filtro de SMS, ative em Ajustes › Mensagens › Remetentes desconhecidos e spam.',
    checklistOpenSettings: 'Abrir ajustes de Telefone',
  },
};

export function t(lang: Lang, key: Keys): string {
  return translations[lang][key];
}
