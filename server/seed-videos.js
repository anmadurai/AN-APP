const supabase = require('./src/config/supabase');
require('dotenv').config();

const videos = [
    { id: 'D86E8qdnw98', title: 'Sunday Morning Service 29-03-26', img: 'sm-01-02-26.png' },
    { id: 'CkEWTo242FU', title: 'Sunday Evening Service 22-03-26', img: 'sm-01-02-26.png' },
    { id: 'Uco0eIZn_ko', title: 'Sunday Morning Service 22-03-26', img: 'sm-01-02-26.png' },
    { id: 'KyJelB0bmxM', title: 'Friday All Night Service 20-03-26', img: 'fri-19-12-25.png'},
    { id: '81dz3-1nuQ8', title: 'Sunday Evening Service 15-03-26', img: 'sm-01-02-26.png' },
    { id: 'uhGf9Zhc_Ig', title: 'Sunday Evening Service 08-03-26', img: 'sm-01-02-26.png' },
    { id: 'VkN1oPyn6fk', title: 'Sunday Morning Service 08-03-26', img: 'sm-01-02-26.png' },
    { id: '7d2Ow5FItso', title: 'Sunday Evening Service 01-03-26', img: 'sm-01-02-26.png' },
    { id: 'a6SUWi08mx8', title: 'Sunday Morning Service 01-03-26', img: 'sm-01-02-26.png' },
    { id: 'XoQTLVXR9gc', title: 'Sunday Evening Service 01-02-26', img: 'sm-01-02-26.png' },
    { id: 'aNAJD7fW8sU', title: 'Sunday Morning Service 01-02-26', img: 'sm-01-02-26.png' },
    { id: 'TB8ZyH2bxUw', title: 'Sunday Morning Service 25-01-26', img: 'sm-25-01-26.png' },
    { id: 'CZy3KwSTtFE', title: 'Sunday Evening Service 18-01-26', img: 'se-18-01-26.png' },
    { id: 'la3Dy_LubAE', title: 'Sunday Evening Service 11-01-26', img: 'se-11-01-26.png' },
    { id: 'yGRiCFYTmlo', title: 'Sunday Morning Service 11-01-26', img: 'sm-11-01-26.png' },
    { id: 'bZa_36h7IxI', title: 'Sunday Evening Service 04-01-26', img: 'se-04-01-26.png' },
    { id: 'inWfLkfHmLY', title: 'Sunday Morning Service 04-01-26', img: 'sm-04-01-26.png' },
    { id: 'AD54GDkbVTs', title: 'NEW YEAR SERVICE - 2026', img: 'ny-2026.png' },
    { id: 'ClA6FPrY33k', title: 'Sunday Second Service 28-12-2025', img: 'se-28-12-25.png' },
    { id: '5HYGQuoGzW0', title: 'Sunday Evening Service 21-12-25', img: 'se-21-12-25.png' },
    { id: 'ss3snHQE8fc', title: 'Sunday Morning Service 21-12-25', img: 'sm-21-12-25.png' },
    { id: 'haKAbKoLLDg', title: 'Friday All Night Service 19-12-25', img: 'fri-19-12-25.png' },
    { id: 'uZJQtDZrwzw', title: 'Wednesday Service 17-12-25', img: 'wd-17-12-25.png' },
    { id: '43nldZKbvT4', title: 'Sunday Second Service 14-12-25', img: 'se-14-12-25.png' },
    { id: 'ZsLLk0Yx78M', title: 'Sunday Morning Service 14-12-25', img: 'sm-14-12-25.png' },
    { id: 'oOPwWv7ID4s', title: 'Friday All Night Service 12-12-25', img: 'fri-12-12-25.png' },
    { id: 'RfsJpkjHRas', title: 'Sunday Evening Service 07-12-25', img: 'eve-07-12-25.png' },
    { id: 'm5rUDxJTQjc', title: 'Sunday Morning Service 07-12-25', img: '07-12-25.png' },
    { id: 'ht8rpqm04j8', title: 'Friday All Night Service 05-12-25', img: '05-12-26.png' },
];

const seedVideos = async () => {
    console.log('Starting sermon video seeding...');
    
    const formattedVideos = videos.map(v => ({
        title: v.title,
        youtube_video_id: v.id,
        thumbnail_url: `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`
    }));

    try {
        const { data, error } = await supabase
            .from('videos')
            .upsert(formattedVideos, { onConflict: 'youtube_video_id' });

        if (error) throw error;
        console.log(`Successfully seeded ${formattedVideos.length} videos.`);
    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        process.exit(0);
    }
};

seedVideos();
