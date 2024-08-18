import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMusicFilter, getMusicType, getMusicDetail } from '../utils/utils';
import Icon from 'react-native-vector-icons/MaterialIcons';

type MusicType = {
  album: string[];
  solo: string[];
  platform: string[];
  language: string[];
};

type MusicData = {
  data: MusicItem[];
  total: number;
};

type MusicItem = {
  name: string;
  album: string;
  solo: string;
  publish_time: string;
  id: string | null;
};

type State = {
  musicList: MusicItem[];
  selectedItems: {
    album: string;
    solo: string;
    platform: string;
    language: string;
  };
  page: number;
  isLoading: boolean;
  musicType: MusicType;
  total: number;
  isModalVisible: boolean;
  selectedMusicId: string | null;
  currentMusicData: any;
};

const musicType: MusicType = {
  album: [
    '全部',
    '山色有无中',
    '琉璃',
    '蚍蜉渡海',
    '腐草为萤',
    '离地十公分EP',
    '风花雪月EP',
    '银临EP(2012)',
    '单曲',
    '其他歌手&OST',
  ],
  solo: [
    '全部',
    'SOLO',
    '双人原唱',
    '多人原创',
    '翻唱',
    '纯音乐',
    '为他人创作',
  ],
  platform: ['全部', '腾讯系', '网易', '跨平台'],
  language: ['全部', '国语', '英语'],
};

class Music extends React.Component<{}, State> {
  state: State = {
    musicList: [], // 存储音乐数据
    selectedItems: {
      album: '全部',
      solo: '全部',
      platform: '全部',
      language: '全部',
    },
    page: 1, // 当前页数
    isLoading: false, // 是否正在加载
    musicType: musicType,
    total: 0,
    isModalVisible: false, // 控制Modal的显示或隐藏
    selectedMusicId: null, // 选中的音乐项
    currentMusicData: {},
  };

  async componentDidMount() {
    const musicType = await getMusicType();
    Object.keys(musicType).forEach((category) => {
      musicType[category as keyof MusicType].unshift('全部');
    });
    musicType.platform = ['全部', '腾讯系', '网易', '跨平台'];
    this.setState({ musicType });
    this.setState({ page: 1 });
    this.loadMusicData(); // 初次加载数据
  }

  loadMusicData = async () => {
    const { page, musicList } = this.state;
    this.setState({ isLoading: true });

    let selectedAlbum: any =
      this.state.selectedItems.album === '全部'
        ? []
        : [this.state.selectedItems.album];
    let selectedSolo: any =
      this.state.selectedItems.solo === '全部'
        ? []
        : [this.state.selectedItems.solo];
    const platformMap: any = {
      腾讯系: ['qq_music'],
      网易: ['netease'],
      跨平台: ['qq_music', 'netease'],
    };
    let selectedPlatform: any =
      this.state.selectedItems.platform === '全部'
        ? []
        : platformMap[this.state.selectedItems.platform];
    let selectedLanguage: any =
      this.state.selectedItems.language === '全部'
        ? []
        : [this.state.selectedItems.language];
    const newMusicData: MusicData = await getMusicFilter(
      selectedAlbum,
      selectedSolo,
      selectedPlatform,
      selectedLanguage,
      page
    );
    await AsyncStorage.setItem('displayMusic', JSON.stringify(newMusicData.data));
    const storedData = await AsyncStorage.getItem('displayMusic');
    const newMusicList = storedData ? JSON.parse(storedData) : [];

    this.setState({
      musicList: [...musicList, ...newMusicList], // 将新数据与旧数据合并
      isLoading: false,
      total: newMusicData.total,
    });
  };

  handlePress = (category: keyof MusicType, item: string) => {
    this.setState(
      (prevState) => ({
        selectedItems: {
          ...prevState.selectedItems,
          [category]: item,
        },
        page: 1, // 重置页数
        musicList: [], // 清空现有数据
      }),
      () => {
        this.loadMusicData(); // 重新加载数据
      }
    );
  };

  handleLoadMore = () => {
    if (!this.state.isLoading) {
      this.setState(
        (prevState) => ({
          page: prevState.page + 1,
        }),
        () => {
          if (this.state.musicList.length < this.state.total) {
            this.loadMusicData(); // 加载下一页数据
          }
        }
      );
    }
  };

  toggleModal = async (musicId: string | null) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      selectedMusicId: musicId,
    });
    if (musicId) {
      const musicDetail = await getMusicDetail(musicId);
      this.setState({ currentMusicData: musicDetail });
    }
  };

  renderFooter = () => {
    if (!this.state.isLoading) {
      return null;
    }
    return <ActivityIndicator size="large" color="#b4a1ce" />;
  };

  render() {
    const { musicList, selectedItems, musicType, isModalVisible, currentMusicData } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {/* 顶部导航部分 */}
        <View style={styles.topNav}>
          {Object.keys(musicType).map((category) => (
            <View key={category} style={styles.navSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {musicType[category as keyof MusicType].map((item: string) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() =>
                      this.handlePress(category as keyof MusicType, item)
                    }
                    style={[
                      styles.navItem,
                      selectedItems[category as keyof MusicType] === item &&
                        styles.selectedNavItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles.navItemText,
                        selectedItems[category as keyof MusicType] === item &&
                          styles.selectedNavItemText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>

        {/* 音乐列表部分 */}
        <FlatList
          contentContainerStyle={{ paddingTop: 170 }} // 确保列表不与顶部导航重叠
          data={musicList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }: { item: MusicItem }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>
                  {item.album} {item.solo} {new Date(item.publish_time).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => this.toggleModal(item.id)}
              >
                <Icon name="more-horiz" size={24} color="#b4a1ce" />
              </TouchableOpacity>
            </View>
          )}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5} // 距离底部的阈值，控制何时触发加载更多
          ListFooterComponent={this.renderFooter} // 底部加载指示器
        />

        {/* Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide" 
          onRequestClose={() => this.toggleModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Image
                  source={{ uri: currentMusicData.cover_url?.split('?')[0].replace('http:', 'https:') }}
                  style={styles.coverImage}
                />
                <View style={styles.headerText}>
                  <Text style={styles.modalTitle}>{currentMusicData.name}</Text>
                  <Text style={styles.modalSubtitle}>{currentMusicData.platform?.netease ? (currentMusicData.platform?.qq_music ? '跨平台' : '网易') : '腾讯系'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => this.toggleModal(null)}
                >
                  <Icon name="close" size={24} color="#b4a1ce" />
                </TouchableOpacity>
              </View>
              <View style={styles.modalDetails}>
                {currentMusicData.staff?.map((staffItem: any) => (
                  <Text style={styles.modalDetail} key={staffItem.type}>
                    {staffItem.type}: {staffItem.name}
                  </Text>
                ))}
                <Text style={styles.modalDetail}>类型: {currentMusicData.music_type}</Text>
                <Text style={styles.modalDetail}>语言: {currentMusicData.language}</Text>
                <Text style={styles.modalDetail}>专辑: {currentMusicData.album}</Text>
                <Text style={styles.modalDetail}>发行时间: {new Date(currentMusicData.publish_time).toLocaleDateString()}</Text>
                <Text style={styles.modalDetail}>有无PV/MV: {currentMusicData.pv_mv || '无'}</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="play-arrow" size={24} color="#b4a1ce" />
                  <Text style={styles.actionText}>下一首播放</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="queue-music" size={24} color="#b4a1ce" />
                  <Text style={styles.actionText}>添加到播放列表末尾</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topNav: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    zIndex: 10,
  },
  navSection: {
    marginBottom: 10,
    marginLeft: 10,
  },
  navItem: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  selectedNavItem: {
    backgroundColor: '#b4a1ce',
    borderColor: '#b4a1ce',
  },
  navItemText: {
    color: '#555',
  },
  selectedNavItemText: {
    color: '#ffffff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#b4a1ce',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  detailButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Modal 从底部弹出
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%', // 宽度为 100%
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  coverImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  closeButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b4a1ce',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#b4a1ce',
  },
  modalDetails: {
    marginBottom: 20,
  },
  modalDetail: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#b4a1ce',
  },
});

export default Music;

