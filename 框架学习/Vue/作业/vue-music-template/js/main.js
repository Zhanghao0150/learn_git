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
                let res = await axios.get('http://localhost:3000/song/url?id=' + id);
                const url = res.data.data[0].url;
                //console.log(res);
                if ('al' in this.musicList[index])
                    this.musicPic = this.musicList[index].al.picUrl;
                else {
                    res = await axios.get('http://localhost:3000/song/detail?ids=' + id);
                    //res.data.songs[0].al.picUrl;
                    if ('songs' in res.data)
                        this.musicPic = res.data.songs[0].al.picUrl;
                }
                res = await axios.get('http://localhost:3000/comment/hot?type=0&id=' + id);
                if ('hotComments' in res.data)
                    this.musciComments = res.data.hotComments;

                if (this.musicUrl !== url)
                    this.musicUrl = url;
            } catch (error) {
                console.log(error);
            }

        },
        // 搜索歌曲
        async seachMusic() {
            //http://localhost:3000/search?keywords=
            try {
                const res = await axios.get('http://localhost:3000/search?keywords=' + this.keywords);
                this.musicList = res.data.result.songs;
                //console.log(this.musicList)
            } catch (error) {
                console.log(error);
            }

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
        async play() {
            this.isplaying = true;
            //this.$refs.audio.play();


        },
        // 音乐暂停
        pause() {
            this.isplaying = false;
            this.$refs.audio.pause();
        },
        // 播放mv
        async playMv(mvId) {
            try {
                if (mvId != 0) {
                    //bug复现的情况，当一个没有mv的音乐正在播放时，直接点击另外一个音乐的播放mv的图标，会同时执行playMv 和playMusic 2个方法。
                    //由于 playMusic方法内 赋予了audio新的musicurl时，因自动播放属性，会重新播放新地址的音乐，导致出现无法暂停新播放的音乐，解决思路：通过延迟一会暂停来解决
                    //修复bug 延迟500毫秒后执行。
                    setTimeout(() => {
                        this.pause()
                    }, 500);

                    const res = await axios.get('http://localhost:3000/mv/url?id=' + mvId);
                    this.mvUrl = res.data.data.url;
                    this.isShow = true;
                }
            } catch (error) {
                console.log(error);
            }

        },
        // 点击遮罩层 隐藏mv
        hide() {
            this.isShow = false;
        },
        getMvId(item) {
            if ('mv' in item) {
                if (item.mv != 0) return item.mv;
            } else if ('mvid' in item)
                if (item.mvid != 0) return item.mvid;
            return 0
        }
    }
})