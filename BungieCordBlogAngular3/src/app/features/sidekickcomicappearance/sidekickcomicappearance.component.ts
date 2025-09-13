import { Component, OnInit } from '@angular/core';
import { SidekickComicAppearanceService } from 'src/app/shared/services/sidekickcomicappearance.service';
import { SidekickComicAppearance } from 'src/app/shared/models/SidekickComicAppearance.model';
import { NotificationService } from 'src/app/features/auth/services/auth.NotificationService';
import { SidekickService } from 'src/app/shared/services/sidekick.service';
import { ComicAppearanceService } from 'src/app/shared/services/comicappearance.service';
import { Sidekick } from 'src/app/shared/models/Sidekick.model';
import { ComicAppearance } from 'src/app/shared/models/ComicAppearance.model';

@Component({
  selector: 'app-sidekickcomicappearance',
  templateUrl: './sidekickcomicappearance.component.html'
})
export class SidekickComicAppearanceComponent implements OnInit {
  links: SidekickComicAppearance[] = [];
  selectedLink: SidekickComicAppearance | null = null;
  isEditing = false;
  sidekicks: Sidekick[] = [];
  comicAppearances: ComicAppearance[] = [];

  constructor(
    private linkService: SidekickComicAppearanceService,
    private notificationService: NotificationService,
    private sidekickService: SidekickService,
    private comicAppearanceService: ComicAppearanceService
  ) {}

  ngOnInit() {
    this.loadLinks();
    this.loadSidekicks();
    this.loadComicAppearances();
  }

  loadLinks() {
    this.linkService.getAll().subscribe(data => this.links = data);
  }

  loadSidekicks() {
    this.sidekickService.getAll().subscribe(data => this.sidekicks = data);
  }

  loadComicAppearances() {
    this.comicAppearanceService.getAll().subscribe(data => this.comicAppearances = data);
  }

  getSidekickName(sidekickId: string): string {
    const sidekick = this.sidekicks.find(s => s.id === sidekickId);
    return sidekick ? sidekick.name : sidekickId;
  }

  getComicTitle(comicAppearanceId: string): string {
    const comic = this.comicAppearances.find(c => c.id === comicAppearanceId);
    return comic ? comic.comicTitle : comicAppearanceId;
  }

  selectLink(link: SidekickComicAppearance) {
    this.selectedLink = { ...link };
    this.isEditing = true;
  }

  newLink() {
    this.selectedLink = {
      sidekickId: '',
      comicAppearanceId: ''
    };
    this.isEditing = false;
  }

  saveLink() {
    if (this.selectedLink?.sidekickId && this.selectedLink?.comicAppearanceId) {
      // Check if editing or creating
      const exists = this.links.some(
        l => l.sidekickId === this.selectedLink!.sidekickId && l.comicAppearanceId === this.selectedLink!.comicAppearanceId
      );
      if (this.isEditing) {
        this.linkService.update(
          this.selectedLink.sidekickId,
          this.selectedLink.comicAppearanceId,
          this.selectedLink
        ).subscribe(() => {
          this.loadLinks();
          this.selectedLink = null;
          this.notificationService.show('Link updated successfully!');
        });
      } else {
        this.linkService.create(this.selectedLink).subscribe(() => {
          this.loadLinks();
          this.selectedLink = null;
          this.notificationService.show('Link created successfully!');
        });
      }
    }
  }

  deleteLink(sidekickId: string, comicAppearanceId: string) {
    this.linkService.delete(sidekickId, comicAppearanceId).subscribe(() => {
      this.loadLinks();
      this.notificationService.show('Link deleted successfully!');
    });
  }

  cancel() {
    this.selectedLink = null;
  }
}