import { Dimensions, Image, StyleSheet, View } from 'react-native';
import StageAdvanceButton from './StageAdvanceButton';

const { height: screenHeight } = Dimensions.get('window');

export default function WordRecordLayoutMVP({
  block,
  imageAsset,
  showImage = true,
  onPlayAudio,
  onShowTip,
  stars = null,
  showTipIcon = true,
  showInfoIcon = true,
  topContent,
  bottomContent,
  showAnswer = true,
  stage,
  wordId,
  onAdvanceStage = () => {},
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, !showImage && { height: screenHeight * 0.478 }]}>
        {showImage && imageAsset && (
          <Image source={imageAsset} style={styles.image} resizeMode="cover" />
        )}

        {stars && <View style={styles.starRow}>{stars}</View>}

        {typeof stage === 'number' && stage < 4 && wordId && (
          <StageAdvanceButton
            wordId={wordId}
            currentStage={stage}
            onStageChange={onAdvanceStage}
            skipLearn={true}
          />
        )}
      </View>

      <View style={styles.textSection}>
        {topContent}
        {bottomContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    height: screenHeight * 0.5,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  starRow: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
});
