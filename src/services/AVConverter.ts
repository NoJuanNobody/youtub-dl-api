// import ffmpeg from 'fluent-ffmpeg'
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import youtubedl from 'youtube-dl';

/**
 * wrapper that handles ffmpeg conversion from mp4 to mp3
 * @param video
 */
async function convertToAudio(ref: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const fsRef = await fs.createReadStream(`files/${ref}.mp4`);
    return await ffmpeg()
      .input(fsRef)
      .output(`files/${ref}.mp3`)
      .on('end', () => {
        console.log("audio converted")
        return resolve(`files/${ref}.mp3`)
      }
      )
      .on('error', () => {
        console.log('reject')
        return reject();
      }
      )
      .run();
  })

}

/**
 * youtube-dl rips video file from youtube.com
 * @param url - url of the video to be downloaded
 */
async function requestVideo(url: string) {
  return new Promise((resolve, reject) => {
    const video = youtubedl(`https://www.youtube.com/watch?v=${url}`,
      ['--format=18'],
      {cwd: __dirname});

    video.on('info', function (info) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      console.log('size: ' + info.size)

    })



    video.on('end', async function () {
      console.log('finished downloading!')
      return resolve(convertToAudio(url));
    })
    video.on('error', (e) => e ? reject(e) : null)

    video.pipe(fs.createWriteStream(`files/${url}.mp4`, {flags: 'a'}));
  });
}

export {requestVideo, convertToAudio};

