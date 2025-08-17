import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import { INDEX_LANGS, usePrefs } from '../context/PrefsContext';

export default function LanguagePickerModal({ visible, onClose }) {
  const { indexLang, setIndexLang, autoplay, setAutoplay } = usePrefs();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#111', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>Index language</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {INDEX_LANGS.map((l) => {
              const active = indexLang === l;
              return (
                <TouchableOpacity
                  key={l}
                  onPress={() => setIndexLang(l)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: active ? '#666' : '#222',
                    borderWidth: active ? 0 : 1,
                    borderColor: '#333',
                  }}
                >
                  {/* Show names as-is (no ALL CAPS) */}
                  <Text style={{ color: '#fff', letterSpacing: 0.5 }}>
                    {l}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 12 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>Autoplay (on reveal)</Text>
            <Switch value={autoplay} onValueChange={setAutoplay} />
          </View>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 16, alignSelf: 'flex-end' }}>
            <Text style={{ color: '#89CFF0', fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
