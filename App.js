import React, { useState, useEffect } from 'react';
import './App.css';

const WhenWinApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    date: 'all',
    location: 'all',
    price: 'all',
    radius: '25'
  });
  const [savedEvents, setSavedEvents] = useState(new Set());
  const [checkedInEvents, setCheckedInEvents] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState({
    city: 'Evansville',
    state: 'IN',
    coords: null
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    address: '',
    category: 'personal',
    price: 'Free',
    description: '',
    tags: [],
    image: null
  });

  // Enhanced user data
  const currentUser = {
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    interests: ['personal', 'career', 'fitness'],
    attendedEvents: [1, 3],
    friends: ['user2', 'user3'],
    isEventOrganizer: true,
    organizerProfile: {
      businessName: 'Personal Achievement Tracker',
      verified: false,
      pastEvents: [1, 3],
      followers: ['user2', 'user3', 'user4', 'user5', 'user6']
    }
  };

  const users = {
    user2: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face' },
    user3: { name: 'Marcus Williams', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
    user4: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' }
  };

  // Sample wins/achievements data
  const events = [
    {
      id: 1,
      title: "Completed my first 5K run! 🏃‍♀️",
      date: "2024-07-15",
      time: "06:30",
      location: "Garvin Park",
      address: "Garvin Park, Evansville",
      city: "Evansville",
      state: "IN",
      category: "Sports & Fitness",
      price: "Personal Win",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
      description: "Finally hit my goal of running a full 5K without stopping! Months of training paid off.",
      attendees: 1,
      organizer: {
        name: "Personal Achievement",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
      },
      tags: ["running", "fitness", "goal", "health"],
      interestedUsers: ['user2', 'user4'],
      checkedInUsers: ['user3'],
      photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop"]
    },
    {
      id: 2,
      title: "Got promoted to Senior Developer! 💻",
      date: "2024-07-10",
      time: "14:00",
      location: "Tech Company HQ",
      address: "Downtown Office",
      city: "Evansville",
      state: "IN",
      category: "Career",
      price: "Life Milestone",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=200&fit=crop",
      description: "After 2 years of hard work, I finally got the promotion I've been working towards!",
      attendees: 1,
      organizer: {
        name: "Career Achievement",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
      },
      tags: ["career", "promotion", "tech", "milestone"],
      interestedUsers: ['user2'],
      checkedInUsers: [],
      photos: ["https://images.unsplash.com/photo-1556761175-4b46a572b786?w=200&h=150&fit=crop"]
    },
    {
      id: 3,
      title: "Learned to cook authentic pasta! 🍝",
      date: "2024-07-08",
      time: "19:00",
      location: "Home Kitchen",
      address: "My Kitchen",
      city: "Evansville",
      state: "IN",
      category: "Learning",
      price: "Personal Growth",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=200&fit=crop",
      description: "Mastered making fresh pasta from scratch! Took 3 attempts but finally nailed it.",
      attendees: 1,
      organizer: {
        name: "Cooking Journey",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
      },
      tags: ["cooking", "learning", "food", "skill"],
      interestedUsers: ['user4'],
      checkedInUsers: ['user2'],
      photos: ["https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200&h=150&fit=crop"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Wins', icon: '🏆' },
    { id: 'personal', name: 'Personal', icon: '⭐' },
    { id: 'career', name: 'Career', icon: '💼' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'fitness', name: 'Sports & Fitness', icon: '🏃‍♀️' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'health', name: 'Health & Wellness', icon: '🌱' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const addToCalendar = (event) => {
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.address)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const toggleSaveEvent = (eventId) => {
    const newSavedEvents = new Set(savedEvents);
    if (newSavedEvents.has(eventId)) {
      newSavedEvents.delete(eventId);
    } else {
      newSavedEvents.add(eventId);
    }
    setSavedEvents(newSavedEvents);
  };

  const toggleCheckIn = (eventId) => {
    const newCheckedInEvents = new Set(checkedInEvents);
    if (newCheckedInEvents.has(eventId)) {
      newCheckedInEvents.delete(eventId);
    } else {
      newCheckedInEvents.add(eventId);
    }
    setCheckedInEvents(newCheckedInEvents);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedFilters.category === 'all' || 
                           event.category.toLowerCase().includes(selectedFilters.category) ||
                           event.tags.includes(selectedFilters.category);
    
    return matchesSearch && matchesCategory;
  });

  const EventCard = ({ event }) => {
    const friendsInterested = event.interestedUsers.filter(userId => 
      currentUser.friends.includes(userId)
    );

    return (
      <div className="eventCard">
        <div className="imageContainer">
          <img 
            src={event.image} 
            alt={event.title}
            className="eventImage"
          />
          <button
            onClick={() => toggleSaveEvent(event.id)}
            className="actionButton"
          >
            <span className={`heartIcon ${savedEvents.has(event.id) ? 'saved' : ''}`}>
              {savedEvents.has(event.id) ? '💖' : '🤍'}
            </span>
          </button>
        </div>
        
        <div className="eventContent">
          <div className="eventTitle">{event.title}</div>
          <div className="organizer">{event.organizer.name}</div>
          
          <div className="eventDetails">
            <div className="detailRow">
              <span className="detailIcon">📅</span>
              <span className="detailText">{formatDate(event.date)} at {formatTime(event.time)}</span>
            </div>
            <div className="detailRow">
              <span className="detailIcon">📍</span>
              <span className="detailText">{event.location}, {event.city}</span>
            </div>
            <div className="detailRow">
              <span className="detailIcon">⭐</span>
              <span className="detailText">Personal achievement</span>
              {friendsInterested.length > 0 && (
                <span className="friendsInterested">
                  • {friendsInterested.length} friend{friendsInterested.length > 1 ? 's' : ''} inspired
                </span>
              )}
            </div>
          </div>

          <div className="description">{event.description}</div>
          
          <div className="tagContainer">
            <div className="categoryTag">
              <span className="categoryTagText">{event.category}</span>
            </div>
            <div className="priceTag">
              <span className="priceTagText">{event.price}</span>
            </div>
          </div>
          
          <button
            onClick={() => addToCalendar(event)}
            className="calendarButton"
          >
            <span className="calendarButtonText">📅 Add to Calendar</span>
          </button>
        </div>
      </div>
    );
  };

  const CreateEventModal = () => (
    <div className="modalOverlay">
      <div className="loginContainer">
        <div className="loginHeader">
          <h2 className="loginTitle">Add New Win! 🎉</h2>
          <button 
            onClick={() => setShowCreateEvent(false)}
            className="closeButton"
          >
            ×
          </button>
        </div>
        
        <div className="loginForm">
          <label className="loginLabel">What did you achieve? 🏆</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            placeholder="Describe your win..."
            className="loginInput"
          />

          <div className="formRow">
            <div className="formHalf">
              <label className="loginLabel">Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="loginInput"
              />
            </div>
            <div className="formHalf">
              <label className="loginLabel">Time</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="loginInput"
              />
            </div>
          </div>

          <label className="loginLabel">Tell us more about it</label>
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            placeholder="Share the details of your achievement..."
            rows={4}
            className="loginInput"
            style={{resize: 'none'}}
          />

          <label className="loginLabel">Category</label>
          <select
            value={newEvent.category}
            onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
            className="loginInput"
          >
            {categories.filter(cat => cat.id !== 'all').map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setShowCreateEvent(false);
            alert('Win added! Keep celebrating your achievements! 🎉');
          }}
          disabled={!newEvent.title || !newEvent.description}
          className="loginButton"
        >
          🎉 Add My Win!
        </button>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="container">
      <div className="header">
        <div className="headerTop">
          <div>
            <h1 className="appTitle">When? Win! 🏆</h1>
            <div className="locationRow">
              <span className="locationIcon">📍</span>
              <span className="locationText">{userLocation.city}, {userLocation.state}</span>
            </div>
          </div>
          <div className="headerButtons">
            <button 
              onClick={() => setShowCreateEvent(true)}
              className="createButton"
            >
              <span className="createButtonText">+</span>
            </button>
            <button className="headerButton">
              <span className="headerButtonText">🔔</span>
            </button>
          </div>
        </div>
        
        <div className="searchContainer">
          <span className="searchIcon">🔍</span>
          <input
            type="text"
            placeholder="When did you win? Let's celebrate it!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />
        </div>
        
        <div>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="categorySelector"
          >
            <span className="categoryEmoji">
              {categories.find(cat => cat.id === selectedFilters.category)?.icon || '🏆'}
            </span>
            <span className="categorySelectorText">
              {categories.find(cat => cat.id === selectedFilters.category)?.name || 'All Wins'}
            </span>
            <span className="chevron">
              {showCategoryDropdown ? '▲' : '▼'}
            </span>
          </button>
          
          {showCategoryDropdown && (
            <div className="dropdownContainer">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedFilters({...selectedFilters, category: category.id});
                    setShowCategoryDropdown(false);
                  }}
                  className={`dropdownItem ${selectedFilters.category === category.id ? 'dropdownItemActive' : ''}`}
                >
                  <span className="dropdownEmoji">{category.icon}</span>
                  <span className={`dropdownText ${selectedFilters.category === category.id ? 'dropdownTextActive' : ''}`}>
                    {category.name}
                  </span>
                  {selectedFilters.category === category.id && (
                    <span className="checkmark">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="eventsContainer">
        <div className="eventsHeader">
          <h2 className="eventsTitle">
            {selectedFilters.category === 'all' ? 'All Your Wins' : 'Filtered Wins'}
          </h2>
          <div className="eventCount">
            <span className="eventCountText">{filteredEvents.length} wins</span>
          </div>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="emptyState">
            <div className="emptyStateIcon">🎉</div>
            <div className="emptyStateTitle">No wins yet!</div>
            <div className="emptyStateText">
              Start tracking your achievements and celebrate every victory, big or small!
            </div>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="changeLocationButton"
            >
              Add Your First Win
            </button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );

  const BottomNavigation = () => (
    <div className="bottomNav">
      <button
        onClick={() => setCurrentScreen('home')}
        className="navItem"
      >
        <span className={`navIcon ${currentScreen === 'home' ? 'navIconActive' : ''}`}>🏠</span>
        <span className={`navLabel ${currentScreen === 'home' ? 'navLabelActive' : ''}`}>Home</span>
      </button>
      <button
        onClick={() => setCurrentScreen('calendar')}
        className="navItem"
      >
        <span className={`navIcon ${currentScreen === 'calendar' ? 'navIconActive' : ''}`}>📅</span>
        <span className={`navLabel ${currentScreen === 'calendar' ? 'navLabelActive' : ''}`}>Calendar</span>
      </button>
      <button
        onClick={() => setShowCreateEvent(true)}
        className="navItem"
      >
        <span className={`navIcon ${currentScreen === 'create' ? 'navIconActive' : ''}`}>➕</span>
        <span className={`navLabel ${currentScreen === 'create' ? 'navLabelActive' : ''}`}>Add Win</span>
      </button>
      <button
        onClick={() => setCurrentScreen('saved')}
        className="navItem"
      >
        <span className={`navIcon ${currentScreen === 'saved' ? 'navIconActive' : ''}`}>💖</span>
        <span className={`navLabel ${currentScreen === 'saved' ? 'navLabelActive' : ''}`}>Saved</span>
      </button>
      <button
        onClick={() => setCurrentScreen('profile')}
        className="navItem"
      >
        <span className={`navIcon ${currentScreen === 'profile' ? 'navIconActive' : ''}`}>👤</span>
        <span className={`navLabel ${currentScreen === 'profile' ? 'navLabelActive' : ''}`}>Profile</span>
      </button>
    </div>
  );

  return (
    <div className="app">
      <HomeScreen />
      <BottomNavigation />
      {showCreateEvent && <CreateEventModal />}
      {showCategoryDropdown && (
        <div 
          className="dropdownBackdrop" 
          onClick={() => setShowCategoryDropdown(false)}
        />
      )}
    </div>
  );
};

export default WhenWinApp;