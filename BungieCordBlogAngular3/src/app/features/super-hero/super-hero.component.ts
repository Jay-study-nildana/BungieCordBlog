import { Component, OnInit } from '@angular/core';
import { SuperHeroService } from 'src/app/shared/services/superhero.service';
import { SuperHero } from 'src/app/shared/models/SuperHero.model';
import { SuperPowerService } from 'src/app/shared/services/superpower.service';
import { SuperPower } from 'src/app/shared/models/SuperPower.model';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';
import { SidekickService } from 'src/app/shared/services/sidekick.service';
import { Sidekick } from 'src/app/shared/models/Sidekick.model';
import { ComicAppearanceService } from 'src/app/shared/services/comicappearance.service';
import { ComicAppearance } from 'src/app/shared/models/ComicAppearance.model';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user.model';

interface SuperHeroImage {
  superHeroId: string;
  id: string;
  fileName: string;
  fileExtension: string;
  title: string;
  url: string;
  dateCreated: string;
}

@Component({
  selector: 'app-super-hero',
  templateUrl: './super-hero.component.html'
})
export class SuperHeroComponent implements OnInit {
  heroes: SuperHero[] = [];
  selectedHero: SuperHero | null = null;
  isEditing = false;
  token: string | null = null;
  user: User | undefined;

  // For details view
  detailsHeroId: string | null = null;
  detailsHero: SuperHero | null = null;
  detailsPowers: SuperPower[] = [];
  detailsSidekicks: Sidekick[] = [];
  detailsComicAppearances: ComicAppearance[] = [];
  loadingDetails = false;

  // For image gallery
  detailsImages: SuperHeroImage[] = [];
  gallerySelectedImage: SuperHeroImage | null = null;

  // For image upload
  showImageUploadHeroId: string | null = null;
  imageFile: File | null = null;
  imageTitle: string = '';
  uploadingImage = false;
  uploadError: string = '';
  uploadedImageUrl: string = '';

  constructor(
    private heroService: SuperHeroService,
    private powerService: SuperPowerService,
    private notificationService: NotificationService,
    private sidekickService: SidekickService,
    private comicAppearanceService: ComicAppearanceService,
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  ngOnInit() {

    let token = this.cookieService.get('Authorization');
    this.user = this.authService.getUser();
    this.authService.user().subscribe(u => this.user = u);
    console.log("Current user roles:", this.user?.roles);
    this.loadHeroes();
  }

    hasAdminRole(): boolean {
      console.log(this.user?.roles?.includes('Admin') ?? false);
      console.log("Current user roles:", this.user?.roles);
    return this.user?.roles?.includes('Admin') ?? false;
  }

  hasWriterButNotAdminRole(): boolean {
    const roles = this.user?.roles ?? [];
    return roles.includes('Writer') && !roles.includes('Admin');
  }

  loadHeroes() {
    if (this.hasAdminRole()) {
      console.log("Admin role detected, loading all heroes.");
      this.heroService.getAll().subscribe(data => this.heroes = data);
    } else if (this.hasWriterButNotAdminRole()) {
      console.log("Writer role detected, loading writer-specific heroes.");
      this.heroService.getUserSuperHeroes().subscribe(data => this.heroes = data);
      // TODO: Use writer-specific endpoint here
      // Placeholder for writer role logic
      // Example: this.heroService.getWriterHeroes().subscribe(data => this.heroes = data);
    }
    else {
      console.log("No special role detected, loading nothing");
      
      
    }
  }

  selectHero(hero: SuperHero) {
    this.selectedHero = { ...hero };
    this.isEditing = true;
  }

  newHero() {
    this.selectedHero = {
      name: '',
      alias: '',
      age: 0,
      origin: '',
      firstAppearance: new Date().toISOString(),
      isActive: true
    };
    this.isEditing = false;
  }

  saveHero() {
    if (this.selectedHero?.id) {
      this.heroService.update(this.selectedHero.id, this.selectedHero).subscribe(() => {
        this.loadHeroes();
        this.selectedHero = null;
        this.notificationService.show('SuperHero updated successfully!');
      });
    } else if (this.selectedHero) {
      this.heroService.create(this.selectedHero).subscribe(() => {
        this.loadHeroes();
        this.selectedHero = null;
        this.notificationService.show('SuperHero created successfully!');
      });
    }
  }

  deleteHero(id: string) {
    this.heroService.delete(id).subscribe(() => {
      this.loadHeroes();
      this.notificationService.show('SuperHero deleted successfully!');
    });
  }

  cancel() {
    this.selectedHero = null;
  }

  // Details logic
  toggleDetails(heroId: string) {
    if (this.detailsHeroId === heroId) {
      // Hide details if already open
      this.detailsHeroId = null;
      this.detailsHero = null;
      this.detailsPowers = [];
      this.detailsSidekicks = [];
      this.detailsComicAppearances = [];
      this.detailsImages = [];
      this.gallerySelectedImage = null;
      return;
    }
    this.detailsHeroId = heroId;
    this.loadingDetails = true;
    this.gallerySelectedImage = null;
    // Fetch hero details
    this.heroService.getById(heroId).subscribe(hero => {
      this.detailsHero = hero;
      // Fetch powers for this hero
      this.powerService.getBySuperHero(heroId).subscribe(powers => {
        this.detailsPowers = powers;
        // Fetch sidekicks for this hero
        this.sidekickService.getBySuperHero(heroId).subscribe(sidekicks => {
          this.detailsSidekicks = sidekicks;
          // Fetch comic appearances for this hero
          this.comicAppearanceService.getBySuperHero(heroId).subscribe(comics => {
            this.detailsComicAppearances = comics;
            // Fetch images for this hero
            this.http.get<SuperHeroImage[]>(`https://localhost:7226/api/SuperHeroes/${heroId}/images`)
              .subscribe(images => {
                this.detailsImages = images;
                this.loadingDetails = false;
              });
          });
        });
      });
    });
  }

  // Gallery logic
  selectGalleryImage(image: SuperHeroImage) {
    this.gallerySelectedImage = image;
  }

  // Image upload logic
  openImageUpload(heroId: string) {
    this.showImageUploadHeroId = heroId;
    this.imageFile = null;
    this.imageTitle = '';
    this.uploadError = '';
    this.uploadedImageUrl = '';
  }

  closeImageUpload() {
    this.showImageUploadHeroId = null;
    this.imageFile = null;
    this.imageTitle = '';
    this.uploadError = '';
    this.uploadedImageUrl = '';
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  uploadImage(heroId: string) {
    if (!this.imageFile || !this.imageTitle) {
      this.uploadError = 'Please select an image and enter a title.';
      return;
    }
    this.uploadingImage = true;
    this.uploadError = '';
    const formData = new FormData();
    formData.append('file', this.imageFile);
    formData.append('superhero_id', heroId);
    formData.append('title', this.imageTitle);

    this.http.post<any>(
      `https://localhost:7226/api/SuperHeroes/${heroId}/upload-image-for-superhero`,
      formData
    ).subscribe({
      next: (response) => {
        this.uploadingImage = false;
        this.uploadedImageUrl = response.url;
        this.notificationService.show('Image uploaded successfully!');
        // Optionally refresh gallery after upload
        this.http.get<SuperHeroImage[]>(`https://localhost:7226/api/SuperHeroes/${heroId}/images`)
          .subscribe(images => {
            this.detailsImages = images;
          });
      },
      error: (err) => {
        this.uploadingImage = false;
        this.uploadError = 'Image upload failed. Please try again.';
      }
    });
  }
}