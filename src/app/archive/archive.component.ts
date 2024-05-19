import {Component, OnInit} from '@angular/core';
import {MessageService, PrimeNGConfig} from "primeng/api";
import { FileUploadModule } from 'primeng/fileupload';
import {BadgeModule} from "primeng/badge";
import {ToastModule} from "primeng/toast";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {ArchiveService} from "../services/archive.service";
import { TableModule } from 'primeng/table';
import {saveAs} from "file-saver";


@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [FileUploadModule, BadgeModule, ToastModule, HttpClientModule, CommonModule, TableModule],
  providers: [MessageService, ArchiveService],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
})
export class ArchiveComponent implements OnInit{

  files = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;

  civilianArticle: any[] = []
  sportArticle: any[] = []
  historicArticle: any[] = []

  constructor(private config: PrimeNGConfig, private messageService: MessageService, private archiveService: ArchiveService) {}

  choose(event: any, callback: any) {
    console.log(this.files)
    callback();
  }

  onRemoveTemplatingFile(event: any, file: File, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = 0;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event:any) {
    this.files = event.currentFiles;
    console.log(this.files)
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = 100;
  }

  uploadEvent(callback:any) {
    callback();
  }

  formatSize(bytes:any) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0 && sizes) {
      `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    if (sizes)    return `${formattedSize} ${sizes[i]}`;
    return `${formattedSize}}`
  }

  clearFiles() {
    this.files = []
    this.totalSizePercent = 0
  }


  uploadFile() {
    console.log(this.files)
    let formData = new FormData();
    const reader = new FileReader();
    formData.append("file", this.files[0])
    this.archiveService.uploadFile(formData).subscribe((data)=>{
      console.log('OKK', data)
      this.getAllFiles()
      // this.messageService.add({severity:'success', summary: 'Success', detail: "Request sent !"});
    });
  }


  getAllFiles(){
    this.archiveService.getAllFiles().subscribe(data=>{
      console.log(data)
      this.sportArticle = data.filter(d=>d.fileTopic === "Sports")
      this.historicArticle = data.filter(d=>d.fileTopic === "Historic")
      this.civilianArticle = data.filter(d=>d.fileTopic === "civilian")
    })
  }

  ngOnInit(): void {
    this.getAllFiles();
  }

  downloadFile(filePath: string) {
    console.log(filePath)
    this.archiveService.downloadFile(filePath).subscribe(data=>{
      let downloadUrl = URL.createObjectURL(data)

      console.log('url',downloadUrl)
      saveAs(downloadUrl, filePath);
    })
  }

  rst(event: any) {
    console.log(event)
  }
}
