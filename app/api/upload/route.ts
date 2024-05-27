/**
 * API Route - Upload Files
 * 
 * This API route is designed for initiating a chat session within an application.
 * It handles the processing and uploading of a file necessary for starting a chat session
 * with the OpenAI API. The route manages the receipt of a file through POST request,
 * temporarily saves it, and then uploads it to OpenAI, ultimately returning the
 * file ID for use in further chat-related operations.
 * 
 * Path: /api/upload
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import OpenAI from "openai";
import path from 'path'

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
async function saveLocal(filename:any, data:any){
  let baseDir = path.join(__dirname, '/./tmp/');
  
  fs.writeFileSync(filename, data,  { flag: 'a+' });
}

function saveBase64ToFile(filePath:any, filedata:any) {
  try {
    // Validate file path (optional but recommended)
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided.');
    }

    // Decode base64 string
    // Open the file in append and read/write mode
    const fd = fs.openSync(filePath, 'a+');

    // Seek to the end of the file (important for appending)
    // fs.ftruncateSync(fd, 0); // Truncate to 0 bytes if the file exists (avoids overwriting)

    // Write the binary data to the file
    fs.writeSync(fd, filedata, 0, filedata.length, null);

    // Close the file descriptor
    fs.closeSync(fd);

    console.log(`Successfully wrote base64 data to ${filePath}`);
  } catch (error:any) {
    console.error('Error writing to file:', error.message);
  }
}
export async function POST(request: NextRequest) {
  // Logging the start of the upload process
  console.log(`Upload API call started`);

  // Retrieving the file from the form data
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  // Check if a file was provided in the request
  if (!file) {
    console.log('No file found in the request');
    return NextResponse.json({ success: false });
  }
  const filedata = atob(file)
  const name = "./" + data.get('filename')
  console.log("filename: " + name)
  // for local dir !! not working on vercel

  // Convert file to buffer and write to a temporary location
  const path = './tmp/result.txt' ; //`${new Date().getTime()}`;
  // saveBase64ToFile( path, filedata)
  saveLocal(name, filedata);
  // fs.writeFileSync(path, filedata, {});
  console.log(`File written to ${path}`);

  try {
    // Uploading the file to OpenAI
    console.log('Starting file upload to OpenAI');
    const fileForRetrieval = await openai.files.create({
      file: fs.createReadStream(name),
      
      purpose: "assistants",
    });
    console.log(`File uploaded, ID: ${fileForRetrieval.id}`);

    // Respond with the file ID
    return NextResponse.json({ success: true, files:{ fileId:fileForRetrieval.id,filename:data.get('filename') }});
  } catch (error) {
    // Log and respond to any errors during the upload process
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }
}