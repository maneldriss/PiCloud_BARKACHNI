import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  setActive(event: MouseEvent): void {
    // Remove active class from all buttons
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked button
    const clickedButton = event.target as HTMLElement;
    // Find the parent button if a child element was clicked
    const button = clickedButton.closest('.menu-item');
    if (button) {
      button.classList.add('active');
    }
  }
}