// Reviews Management System
(function(){
  'use strict';
  
  const ADMIN_PASSWORD = 'rewrew'; // Change this to a secure password
  let isAdminMode = false;
  let locale = {};
  let lang = 'ru';
  
  const ReviewsManager = {
    init: function(language, localeData){
      lang = language;
      locale = localeData;
      this.loadAllReviews();
      this.setupForms();
      this.setupAdminPanel();
    },
    
    getStorageKey: function(projectId){
      return `reviews_${lang}_${projectId}`;
    },
    
    getReviews: function(projectId){
      const key = this.getStorageKey(projectId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    },
    
    saveReviews: function(projectId, reviews){
      const key = this.getStorageKey(projectId);
      localStorage.setItem(key, JSON.stringify(reviews));
    },
    
    addReview: function(projectId, review){
      const reviews = this.getReviews(projectId);
      review.id = Date.now();
      review.date = new Date().toISOString();
      reviews.push(review);
      this.saveReviews(projectId, reviews);
      this.renderReviews(projectId);
    },
    
    deleteReview: function(projectId, reviewId){
      let reviews = this.getReviews(projectId);
      reviews = reviews.filter(r => r.id !== reviewId);
      this.saveReviews(projectId, reviews);
      this.renderReviews(projectId);
    },
    
    moveReviewUp: function(projectId, reviewId){
      const reviews = this.getReviews(projectId);
      const idx = reviews.findIndex(r => r.id === reviewId);
      if(idx > 0){
        [reviews[idx-1], reviews[idx]] = [reviews[idx], reviews[idx-1]];
        this.saveReviews(projectId, reviews);
        this.renderReviews(projectId);
      }
    },
    
    renderReviews: function(projectId){
      const container = document.querySelector(`.reviews-list[data-project="${projectId}"]`);
      if(!container) return;
      
      const reviews = this.getReviews(projectId);
      container.innerHTML = '';
      
      if(reviews.length === 0){
        const noReviews = document.createElement('p');
        noReviews.className = 'no-reviews';
        noReviews.textContent = locale.noReviews || 'No reviews yet. Be the first!';
        container.appendChild(noReviews);
        return;
      }
      
      reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        const stars = '⭐'.repeat(review.rating);
        const date = new Date(review.date).toLocaleDateString(lang);
        
        card.innerHTML = `
          <div class="review-header">
            <div class="review-author">
              <strong>${this.escapeHtml(review.name)}</strong>
              <span class="review-position">${this.escapeHtml(review.position)}</span>
            </div>
            <div class="review-rating">${stars}</div>
          </div>
          <p class="review-message">${this.escapeHtml(review.message)}</p>
          <div class="review-footer">
            <span class="review-date">${date}</span>
            ${isAdminMode ? `
              <div class="admin-controls">
                <button class="btn-small move-up" data-id="${review.id}">↑ ${locale.moveUp || 'Move Up'}</button>
                <button class="btn-small delete-review" data-id="${review.id}">🗑️ ${locale.deleteReview || 'Delete'}</button>
              </div>
            ` : ''}
          </div>
        `;
        
        if(isAdminMode){
          card.querySelector('.move-up').addEventListener('click', () => {
            this.moveReviewUp(projectId, review.id);
          });
          card.querySelector('.delete-review').addEventListener('click', () => {
            if(confirm('Are you sure you want to delete this review?')){
              this.deleteReview(projectId, review.id);
            }
          });
        }
        
        container.appendChild(card);
      });
    },
    
    loadAllReviews: function(){
      document.querySelectorAll('.reviews-list').forEach(list => {
        const projectId = list.dataset.project;
        this.renderReviews(projectId);
      });
    },
    
    setupForms: function(){
      document.querySelectorAll('.review-form').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const projectId = form.dataset.project;
          const formData = new FormData(form);
          const review = {
            name: formData.get('name'),
            position: formData.get('position'),
            message: formData.get('message'),
            rating: parseInt(formData.get('rating'))
          };
          this.addReview(projectId, review);
          form.reset();
          alert('Thank you for your review!');
        });
      });
    },
    
    setupAdminPanel: function(){
      document.querySelectorAll('.admin-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          if(!isAdminMode){
            const password = prompt('Enter admin password:');
            if(password === ADMIN_PASSWORD){
              isAdminMode = true;
              btn.textContent = '🔓 ' + (locale.editMode || 'Edit Mode') + ' ON';
              btn.style.backgroundColor = '#f39c12';
              this.loadAllReviews();
            } else {
              alert('Invalid password!');
            }
          } else {
            isAdminMode = false;
            btn.textContent = locale.adminMode || 'Edit Mode';
            btn.style.backgroundColor = '';
            this.loadAllReviews();
          }
        });
      });
    },
    
    escapeHtml: function(text){
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };
  
  window.ReviewsManager = ReviewsManager;
})();
