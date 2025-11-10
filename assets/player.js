// YouTube-style Video Player JavaScript
class VideoPlayer {
    constructor() {
        this.video = document.getElementById('mainVideo');
        this.screenshotImg = document.getElementById('screenshotImg');
        this.talkingHeadCircle = document.getElementById('talkingHeadCircle');
        this.circleVideoDisplay = document.getElementById('circleVideoDisplay');
        this.videoControls = document.getElementById('videoControls');
        this.progress = document.getElementById('progress');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.durationDisplay = document.getElementById('duration');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playPauseIcon = document.getElementById('playPauseIcon');
        this.muteBtn = document.getElementById('muteBtn');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.videoPlayer = document.querySelector('.video-player');
        this.playOverlay = document.getElementById('playOverlay');
        this.centerPlayButton = document.getElementById('centerPlayButton');
        
        this.isPlaying = false;
        this.isDragging = false;
        this.scrollTimeout = null; // For delayed scroll animation
        
        this.init();
    }
    
    init() {
        // Set up event listeners - all controls control the ONE video
        this.playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); this.togglePlay(); });
        this.muteBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMute(); });
        this.fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFullscreen(); });
        this.talkingHeadCircle.addEventListener('click', () => this.togglePlay());
        this.centerPlayButton.addEventListener('click', (e) => { e.stopPropagation(); this.togglePlay(); });
        
        // Make entire video player area clickable for play/pause
        this.videoPlayer.addEventListener('click', () => this.togglePlay());
        
        this.video.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
        this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.video.addEventListener('ended', () => this.onVideoEnded());
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());
        this.video.addEventListener('volumechange', () => this.onVolumeChange());
        
        // Progress bar interactions
        this.progressBar.addEventListener('click', (e) => { e.stopPropagation(); this.seekTo(e); });
        this.progressBar.addEventListener('mousedown', (e) => { e.stopPropagation(); this.startDrag(e); });
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Show/hide controls on hover
        this.videoPlayer.addEventListener('mouseenter', () => this.showControls());
        this.videoPlayer.addEventListener('mouseleave', () => this.hideControls());
        
        // Prevent controls from triggering video player click
        this.videoControls.addEventListener('click', (e) => e.stopPropagation());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeypress(e));
        
        // Move video to circle initially and start playing
        this.moveVideoToCircle();
        this.video.play().catch(() => {
            // Autoplay might be blocked, show play button
            this.playOverlay.classList.remove('hidden');
        });
    }
    
    moveVideoToCircle() {
        // Move the video element to the circle display
        this.circleVideoDisplay.appendChild(this.video);
        this.video.style.display = 'block';
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.objectFit = 'cover';
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.video.play();
        this.scheduleScrollAnimation();
    }
    
    scheduleScrollAnimation() {
        // Get scroll delay from video data attribute (in seconds)
        const scrollDelay = parseFloat(this.video.dataset.scrollDelay) || 0;
        
        // Clear any existing timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Schedule the scroll animation
        this.scrollTimeout = setTimeout(() => {
            this.startScrollAnimation();
        }, scrollDelay * 1000); // Convert to milliseconds
    }
    
    startScrollAnimation() {
        // Remove any existing animation class first
        this.screenshotImg.classList.remove('scrolling');
        
        // Trigger reflow to ensure class removal is processed
        this.screenshotImg.offsetHeight;
        
        // Set animation duration - snappy and realistic (4-6 seconds)
        const videoDuration = this.video.duration || 6;
        const animationDuration = Math.min(Math.max(videoDuration * 0.5, 4), 6); // 50% of video duration, min 4s, max 6s
        this.screenshotImg.style.setProperty('--animation-duration', `${animationDuration}s`);
        
        // Add the scrolling animation class
        this.screenshotImg.classList.add('scrolling');
    }
    
    pause() {
        this.video.pause();
        this.stopScrollAnimation();
    }
    
    stopScrollAnimation() {
        // Clear any pending scroll animation
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
        }
        
        // Remove the scrolling animation class
        this.screenshotImg.classList.remove('scrolling');
    }
    
    onPlay() {
        this.isPlaying = true;
        this.talkingHeadCircle.classList.add('playing');
        this.updatePlayPauseIcon();
        this.playOverlay.classList.add('hidden');
    }
    
    onPause() {
        this.isPlaying = false;
        this.talkingHeadCircle.classList.remove('playing');
        this.updatePlayPauseIcon();
        this.playOverlay.classList.remove('hidden');
    }
    
    updatePlayPauseIcon() {
        if (this.isPlaying) {
            this.playPauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        } else {
            this.playPauseIcon.innerHTML = '<polygon points="5,3 19,12 5,21" fill="white"/>';
        }
    }
    
    showControls() {
        this.videoControls.classList.add('show');
    }
    
    hideControls() {
        if (this.isPlaying) {
            this.videoControls.classList.remove('show');
        }
    }
    
    onMetadataLoaded() {
        const duration = this.formatTime(this.video.duration);
        this.durationDisplay.textContent = duration;
    }
    
    onTimeUpdate() {
        if (!this.isDragging) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progress.style.width = progress + '%';
        }
        
        const currentTime = this.formatTime(this.video.currentTime);
        this.currentTimeDisplay.textContent = currentTime;
    }
    
    onVideoEnded() {
        this.isPlaying = false;
        this.talkingHeadCircle.classList.remove('playing');
        this.updatePlayPauseIcon();
        this.progress.style.width = '0%';
        this.video.currentTime = 0;
        this.playOverlay.classList.remove('hidden');
    }
    
    seekTo(e) {
        if (!this.video.duration) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const time = pos * this.video.duration;
        
        this.video.currentTime = Math.max(0, Math.min(time, this.video.duration));
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.seekTo(e);
    }
    
    drag(e) {
        if (this.isDragging) {
            this.seekTo(e);
        }
    }
    
    endDrag() {
        this.isDragging = false;
    }
    
    handleKeypress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }
    
    toggleMute() {
        this.video.muted = !this.video.muted;
    }
    
    onVolumeChange() {
        if (this.video.muted) {
            this.muteBtn.classList.add('muted');
            this.volumeIcon.innerHTML = '<path fill="#ff4444" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else {
            this.muteBtn.classList.remove('muted');
            this.volumeIcon.innerHTML = '<path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.videoPlayer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});

// Add some nice touch interactions for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        // Add touch feedback
        if (e.target.closest('.video-overlay')) {
            e.target.closest('.video-overlay').style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        // Remove touch feedback
        if (e.target.closest('.video-overlay')) {
            setTimeout(() => {
                if (e.target.closest('.video-overlay')) {
                    e.target.closest('.video-overlay').style.transform = '';
                }
            }, 150);
        }
    });
}