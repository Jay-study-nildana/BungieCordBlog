import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Image {
  id: string;
  fileName: string;
  fileExtension: string;
  title: string;
  url: string;
  dateCreated: string;
}

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html'
})
export class ImagesComponent implements OnInit {
  images: Image[] = [];
  selectedFile: File | null = null;
  title: string = '';
  fileName: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.http.get<Image[]>('https://localhost:7226/api/Images')
      .subscribe({
        next: (data) => this.images = data,
        error: () => this.errorMessage = 'Failed to load images.'
      });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile?.name || '';
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedFile || !this.title || !this.fileName) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const formData = new FormData();
    formData.append('File', this.selectedFile, this.selectedFile.name);
    formData.append('FileName', this.fileName);
    formData.append('Title', this.title);

    this.http.post<Image>('https://localhost:7226/api/Images', formData)
      .subscribe({
        next: (img) => {
          this.successMessage = 'Image uploaded successfully!';
          this.images.push(img);
          this.selectedFile = null;
          this.title = '';
          this.fileName = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Image upload failed.';
        }
      });
  }
}