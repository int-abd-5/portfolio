import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "ASL Voice Bridge",
    category: "AI Accessibility Platform",
    tools: "Computer Vision, STT/TTS, Real-time Inference",
    image: "/images/project-asl.svg",
    link: "https://github.com/int-abd-5/ASL-to-Voice-and-Voice-to-ASL-in-Realtime_SignLanguage",
  },
  {
    title: "CrisisNLP Intelligence Engine",
    category: "AI/NLP + Decision Support",
    tools: "Python, Flask, Validation, Summarization, Extraction",
    image: "/images/project-crisisnlp.svg",
    link: "https://github.com/int-abd-5/CrisisNLP",
  },
  {
    title: "CrisisConnect Operations Platform",
    category: "Mobile + Backend Response System",
    tools: "Kotlin, Real-time Alerts, Incident Coordination",
    image: "/images/project-crisisconnect.svg",
    link: "https://github.com/int-abd-5/CrisisConnect",
  },
  {
    title: "SkillSwap",
    category: "Full-Stack Realtime Product",
    tools: "React, Node.js, MySQL, WebSockets, Gamification",
    image: "/images/project-skillswap.svg",
    link: "https://github.com/int-abd-5/-SkillSwap-Peer-to-Peer-Skill-Exchange-Platform",
  },
  {
    title: "Voice Sphere Assistant",
    category: "Conversational AI",
    tools: "Python, LLM Integration, Voice UX",
    image: "/images/project-voicesphere.svg",
    link: "https://github.com/int-abd-5/voice_sphere",
  },
  {
    title: "DevOps Automation Lab",
    category: "CI/CD + Container Workflow",
    tools: "Docker, Jenkins, GitHub Actions, Deployment Pipelines",
    image: "/images/project-devopslab.svg",
    link: "https://github.com/int-abd-5/crisisconnectbackend",
  },
];

const repositories = [
  {
    name: "ASL-to-Voice-and-Voice-to-ASL-in-Realtime_SignLanguage",
    link: "https://github.com/int-abd-5/ASL-to-Voice-and-Voice-to-ASL-in-Realtime_SignLanguage",
    language: "JavaScript",
  },
  {
    name: "Drawing-Board-in-c--",
    link: "https://github.com/int-abd-5/Drawing-Board-in-c--",
    language: "C++",
  },
  {
    name: "-SkillSwap-Peer-to-Peer-Skill-Exchange-Platform",
    link: "https://github.com/int-abd-5/-SkillSwap-Peer-to-Peer-Skill-Exchange-Platform",
    language: "Web",
  },
  {
    name: "CrisisNLP",
    link: "https://github.com/int-abd-5/CrisisNLP",
    language: "Python",
  },
  {
    name: "skillswapplatform",
    link: "https://github.com/int-abd-5/skillswapplatform",
    language: "TypeScript",
  },
  {
    name: "Stt-Sign-Language-Model",
    link: "https://github.com/int-abd-5/Stt-Sign-Language-Model",
    language: "JavaScript",
  },
  {
    name: "CrisisConnectData",
    link: "https://github.com/int-abd-5/CrisisConnectData",
    language: "Python",
  },
  {
    name: "crisisconnectbackend",
    link: "https://github.com/int-abd-5/crisisconnectbackend",
    language: "Kotlin",
  },
  {
    name: "Solitaire-Game-Implemented-Using-Data-structures",
    link: "https://github.com/int-abd-5/Solitaire-Game-Implemented-Using-Data-structures",
    language: "C++",
  },
  {
    name: "CrisisConnect",
    link: "https://github.com/int-abd-5/CrisisConnect",
    language: "Kotlin",
  },
  {
    name: "voice_sphere",
    link: "https://github.com/int-abd-5/voice_sphere",
    language: "Python",
  },
  {
    name: "Catching-Alphabets-in-Assembly-Language",
    link: "https://github.com/int-abd-5/Catching-Alphabets-in-Assembly-Language",
    language: "Assembly",
  },
  {
    name: "Customer-Service-Module",
    link: "https://github.com/int-abd-5/Customer-Service-Module",
    language: "C++",
  },
  {
    name: "Flappy-bird-using-unity",
    link: "https://github.com/int-abd-5/Flappy-bird-using-unity",
    language: "Unity",
  },
  {
    name: "Facebook-clone-",
    link: "https://github.com/int-abd-5/Facebook-clone-",
    language: "C++",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>

        <div className="repo-list">
          <h3>All GitHub Repositories</h3>
          <div className="repo-grid">
            {repositories.map((repo) => (
              <a
                className="repo-card"
                href={repo.link}
                target="_blank"
                rel="noreferrer"
                key={repo.name}
                data-cursor="disable"
              >
                <h4>{repo.name}</h4>
                <p>{repo.language}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
