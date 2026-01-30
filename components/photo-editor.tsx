import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useColors } from "@/hooks/use-colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;

interface PhotoEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (uri: string) => void;
  currentPhoto?: string;
  executiveName: string;
}

export function PhotoEditor({
  visible,
  onClose,
  onSave,
  currentPhoto,
  executiveName,
}: PhotoEditorProps) {
  const colors = useColors();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const lastPosition = useRef({ x: 0, y: 0 });
  const lastScale = useRef(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastPosition.current = { ...position };
      },
      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        setPosition({
          x: lastPosition.current.x + gestureState.dx,
          y: lastPosition.current.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        lastPosition.current = { ...position };
      },
    })
  ).current;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    setSaving(true);
    try {
      // Para web, salvamos a URI diretamente
      // Em produção, seria necessário processar o recorte no servidor
      const fileName = `executive-${executiveName
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}.jpg`;
      
      if (Platform.OS === "web") {
        // No web, passamos a URI original com os parâmetros de transformação
        onSave(selectedImage);
      } else {
        // No mobile, copiamos para o diretório do app
        const newPath = `${FileSystem.documentDirectory || ''}${fileName}`;
        await FileSystem.copyAsync({
          from: selectedImage,
          to: newPath,
        });
        onSave(newPath);
      }
      
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      alert("Erro ao salvar a foto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Editar Foto
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            style={styles.headerButton}
            disabled={!selectedImage || saving}
          >
            <Text
              style={[
                styles.headerButtonText,
                {
                  color: selectedImage && !saving ? colors.primary : colors.muted,
                },
              ]}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Editor Area */}
        <View style={styles.editorArea}>
          {/* Circular Mask */}
          <View style={styles.maskContainer}>
            <View
              style={[
                styles.circleOverlay,
                { borderColor: colors.primary },
              ]}
            >
              {selectedImage ? (
                <View
                  style={styles.imageContainer}
                  {...panResponder.panHandlers}
                >
                  <Image
                    source={{ uri: selectedImage }}
                    style={[
                      styles.editableImage,
                      {
                        transform: [
                          { scale: scale },
                          { translateX: position.x / scale },
                          { translateY: position.y / scale },
                        ],
                      },
                    ]}
                    contentFit="cover"
                  />
                </View>
              ) : currentPhoto ? (
                <Image
                  source={{ uri: currentPhoto }}
                  style={styles.currentImage}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.placeholder,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={[styles.placeholderText, { color: colors.muted }]}>
                    Selecione uma foto
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Instructions */}
          <Text style={[styles.instructions, { color: colors.muted }]}>
            {selectedImage
              ? "Arraste para mover • Use os botões para zoom"
              : "Toque em 'Escolher Foto' para selecionar uma imagem"}
          </Text>
        </View>

        {/* Controls */}
        <View style={[styles.controls, { backgroundColor: colors.surface }]}>
          {/* Zoom Controls */}
          {selectedImage && (
            <View style={styles.zoomControls}>
              <TouchableOpacity
                onPress={handleZoomOut}
                style={[styles.zoomButton, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.zoomButtonText, { color: colors.foreground }]}>
                  −
                </Text>
              </TouchableOpacity>
              <View style={styles.zoomIndicator}>
                <Text style={[styles.zoomText, { color: colors.foreground }]}>
                  {Math.round(scale * 100)}%
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleZoomIn}
                style={[styles.zoomButton, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.zoomButtonText, { color: colors.foreground }]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Pick Image Button */}
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.pickButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.pickButtonText}>
              {selectedImage ? "Trocar Foto" : "Escolher Foto"}
            </Text>
          </TouchableOpacity>

          {/* Reset Button */}
          {selectedImage && (
            <TouchableOpacity
              onPress={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              style={[styles.resetButton, { borderColor: colors.border }]}
            >
              <Text style={[styles.resetButtonText, { color: colors.foreground }]}>
                Resetar Posição
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerButton: {
    minWidth: 80,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editorArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  maskContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleOverlay: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    overflow: "hidden",
  },
  editableImage: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  currentImage: {
    width: CIRCLE_SIZE - 6,
    height: CIRCLE_SIZE - 6,
    borderRadius: (CIRCLE_SIZE - 6) / 2,
  },
  placeholder: {
    width: CIRCLE_SIZE - 6,
    height: CIRCLE_SIZE - 6,
    borderRadius: (CIRCLE_SIZE - 6) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    textAlign: "center",
  },
  instructions: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
  controls: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  zoomControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  zoomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomButtonText: {
    fontSize: 28,
    fontWeight: "300",
  },
  zoomIndicator: {
    minWidth: 60,
    alignItems: "center",
  },
  zoomText: {
    fontSize: 16,
    fontWeight: "500",
  },
  pickButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  pickButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
