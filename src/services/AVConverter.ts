// import ffmpeg from 'fluent-ffmpeg'
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import youtubedl from 'youtube-dl';

/**
 * wrapper that handles ffmpeg conversion from mp4 to mp3
 * @param video
 */
async function convertToAudio(ref: string): Promise<string> {

  //  TODO: implement fluent ffmpeg to convert a video to an audio file
  const fsRef = fs.createReadStream(`files/${ref}`);
  ffmpeg()
    .input(fsRef)
    .output(`files/${ref}.mp3`)
    .run();
  return `files/${ref}.mp3`
}

/**
 * youtube-dl rips video file from youtube.com
 * @param url - url of the video to be downloaded
 */
async function requestVideo(url: string) {
  console.log(url);
  let name = '';
  const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    {cwd: __dirname})

  // Will be called when the download starts.
  video.on('info', function (info) {
    console.log('Download started')
    name = info._filename;
    console.log(name);
    video.pipe(fs.createWriteStream(`files/${info._filename}`, {flags: 'a'}));
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
  })
  // TODO: add error handling to avoid empty mp4 files

  video.on('complete', function complete(info) {
    'use strict'
    console.log('filename: ' + info._filename + ' already downloaded.')

  })

  video.on('end', function (info) {
    console.log('finished downloading!')
    convertToAudio(name)
  })
}

export {requestVideo};

