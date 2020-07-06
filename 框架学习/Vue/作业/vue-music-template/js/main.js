let vm = new Vue({
    el: '.wrap',
    data: {
        currentIndex: -1,
        isplaying: false, //是否正在播放
        isMvShow: false, //mv图标false默认不显示
        keywords: '', //搜索内容
        musicList: [], //所有歌曲列表
        musicPic: '', //歌曲图片
        musciComments: [], //音乐热门评论
        musicUrl: '', //音乐播放地址
        isShow: false, //mv默认不显示
        mvUrl: '', //mv的url地址
        flag: true, //用户控制用户点击回车键是否可以再点击(1.3s)
    },
    created() {
        // 创建完成
        // 获取所有歌曲列表
        this.getSongsList();
    },
    methods: {
        // 获取所有歌曲列表
        /*  getSongsList(){
           axios.get('http://localhost:3000/artist/top/song?id=6452')
           .then(res=>{
             console.log(res.data.songs);
             this.musicList = res.data.songs;
             
           })
           .catch(err=>{

           })
         }, */
        async getSongsList() {
            // 几块钱 值
            try {
                //  让异步代码同步化
                const res = await axios.get('http://localhost:3000/artist/top/song?id=6452');
                this.musicList = res.data.songs;
            } catch (error) {
                console.log(error);

            }
        },


        //  播放音乐
        async playMusic(id, index) {
            this.currentIndex = index;
            try {
                const res = await axios.get('http://localhost:3000/song/url?id=' + id);
                const url = res.data.data[0].url;
                if (this.musicUrl !== url)
                    this.musicUrl = url;
            } catch (error) {
                console.log(error);
            }

        },
        // 搜索歌曲
        seachMusic() {


        },
        // 上一首
        prev() {
            if (this.currentIndex > 0 && this.musicList.length != 0) {
                this.currentIndex -= 1;
                const id = this.musicList[this.currentIndex].id;
                console.log(id);
                this.playMusic(id, this.currentIndex);
            } else {
                alert("上面没有了");
            }

        },
        // 下一首
        next() {
            if (this.currentIndex >= 0 && this.currentIndex < this.musicList.length) {
                this.currentIndex += 1;
                const id = this.musicList[this.currentIndex].id;
                console.log(id);
                this.playMusic(id, this.currentIndex);
            } else {
                alert("上面没有了");
            }
        },
        // 音乐播放
        play() {

        },
        // 音乐暂停
        pause() {},
        // 播放mv
        playMv(mvId) {},
        // 点击遮罩层 隐藏mv
        hide() {

        }
    }
})