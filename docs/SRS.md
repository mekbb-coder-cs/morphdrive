# Software Requirements Specification (SRS)
## Project: MorphDrive — Interactive 3D Educational Inspection & Morphing Mechanism Platform
**Document Identifier**: `SRS-MORPHDRIVE-V1.0`  
**Standard Compliance**: IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018  
**Version**: 1.0.0  
**Status**: Formal Baseline  
**Date of Issue**: November 2026  

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [User Personas & Operational Scenarios](#3-user-personas--operational-scenarios)
4. [Detailed System Feature List](#4-detailed-system-feature-list)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [Non-Functional Requirements (NFR)](#6-non-functional-requirements-nfr)
7. [Verification, Validation & Traceability Matrix](#7-verification-validation--traceability-matrix)
8. [Glossary & Acronyms](#8-glossary--acronyms)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional, structural, and behavioral requirements for **MorphDrive**—a high-performance, web-native 3D platform engineered for the inspection, disassembly, and dynamic transformation of reconfigurable mechanical and aerospace assemblies. It provides the technical foundation for the development team, academic supervisors, and testing stakeholders.

### 1.2 Document Conventions (RFC 2119)
The key words **"MUST"**, **"MUST NOT"**, **"REQUIRED"**, **"SHALL"**, **"SHALL NOT"**, **"SHOULD"**, **"SHOULD NOT"**, **"RECOMMENDED"**, **"MAY"**, and **"OPTIONAL"** in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

### 1.3 Intended Audience
- **Primary**: Academic Project Evaluators, Software Engineers, 3D Technical Artists.
- **Secondary**: Mechanical & Aerospace Engineering Faculty, Teaching Assistants, Enrolled Students.

### 1.4 Product Scope
MorphDrive bridges the pedagogical gap between static 2D engineering drawings and heavy industrial CAD suites (e.g. SolidWorks, CATIA, NX). The platform enables continuous, interactive morphing of variable-geometry machines in real time on consumer-grade hardware without plug-in installation.
* **In-Scope**: WebGL2 3D rendering, continuous kinematic morphing (shape-key and bone rigging), multi-axis exploded view disassembly, planar cross-section clipping, component isolation, PBR material manipulation, and user authentication with loadout persistence.
* **Out-of-Scope**: Computational Fluid Dynamics (CFD), Finite Element Analysis (FEA) stress solving, Virtual Reality (VR/WebXR) headset runtimes, and parametric CAD sketch/extrude authoring.

### 1.5 References
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. ISO/IEC/IEEE 29148:2018: *Systems and software engineering — Life cycle processes — Requirements engineering*.
3. Khronos Group: *glTF 2.0 Specification & Draco Mesh Compression Extension*.
4. Khronos Group: *WebGL 2.0 Specification (OpenGL ES 3.0 Web Binding)*.

---

## 2. Overall Description

### 2.1 Product Perspective & Context Architecture
MorphDrive is organized as a unified monorepo (`apps/web`, `apps/api`, `packages/shared`) deployed across a global edge CDN (Vercel) and containerized backend compute (Railway/Render) backed by PostgreSQL.

### 2.2 Product Functions Overview
1. **Interactive Assembly Viewing**: Free 360° orbital inspection, directional panning, and zoom scaling with physical camera damping.
2. **Continuous Kinematic Morphing**: Bidirectional interpolation between calibrated structural operating modes (e.g., *Street* $\leftrightarrow$ *Off-Road* $\leftrightarrow$ *Flight*).
3. **Exploded Disassembly**: Smooth mechanical separation along pre-calculated vector paths.
4. **Planar Slicing**: Real-time cross-section slicing across Sagittal (X), Axial (Y), and Coronal (Z) axes to inspect internal clearances and cavities.
5. **Component Hierarchy Isolation**: One-click isolation of sub-assemblies (chassis, canopy, wings, actuators, wheels) with surrounding geometry ghosting.
6. **Telemetry Specification Meter**: Dynamic calculation of velocity, downforce, ride clearance, and handling agility based on real-time mechanism geometry.

### 2.3 User Classes & Characteristics
* **Student User**: Non-administrative consumer. Needs rapid 3D inspection, smooth performance on battery-constrained laptops, intuitive touch/mouse controls, and instant loadout resets.
* **Instructor User**: Advanced author. Requires model verification, presentation presets, callout creation, and the ability to demonstrate kinematics in lecture halls.
* **Administrator User**: System operator. Manages user accounts, enforces database migrations, and updates machine catalog definitions.

### 2.4 Operating Environment
* **Client Hardware**: Standard laptop or desktop workstation with integrated GPU (Intel Iris Xe, AMD Radeon Vega, Apple M-Series) or dedicated GPU. Minimum 4GB RAM.
* **Client Software**: Evergreen web browser with WebGL 2.0 support (Google Chrome $\ge 110$, Apple Safari $\ge 16$, Mozilla Firefox $\ge 115$, Microsoft Edge $\ge 110$).
* **Server Runtime**: Node.js $\ge 22.0.0$, Express 4.21, PostgreSQL 16, Linux x86_64 container.

---

## 3. User Personas & Operational Scenarios

### 3.1 Persona 1: Mechanical / Aerospace Student
* **Name**: Alex Chen (3rd-Year Aerospace Engineering Undergraduate)
* **Context**: Enrolled in Aircraft Design & Mechanical Kinematics. Works predominantly on an Apple M2 MacBook Air.
* **Goals**: Spatially understand how variable-geometry mechanisms transition dynamically; inspect internal actuator clearances; export annotated technical screenshots.
* **Frustrations**: Heavy CAD software takes minutes to load and drains battery; textbook 2D diagrams fail to show 3D mechanism clearance limits.

### 3.2 Persona 2: Course Instructor / Teaching Assistant
* **Name**: Dr. Marcus Vance (Associate Professor, Mechanical & Aerospace Engineering)
* **Context**: Lectures 120 students in Machine Design and Flight Dynamics.
* **Goals**: Demonstrate dynamic kinematic singularities during live lectures; pause mechanism morph at partial transition points; assign interactive inspection homework.
* **Frustrations**: Slide video clips cannot be rotated; commercial CAD suites are too cluttered for live lecture demonstrations.

### 3.3 Persona 3: Academic / Laboratory Administrator
* **Name**: Sarah Jenkins (Department IT & Laboratory Systems Manager)
* **Context**: Oversees department compute budgets, security compliance, and laboratory hardware.
* **Goals**: Minimize recurring software license costs; avoid high-maintenance VR headset hardware; ensure student data privacy compliance.

---

## 4. Detailed System Feature List

### 4.1 Feature Set 1: WebGL 3D Canvas & Camera Navigation
* **FEAT-1.1 (Studio Lighting)**: ACESFilmic tone mapping, studio directional lights, and soft ground contact shadows.
* **FEAT-1.2 (Camera Manipulation)**: 360° orbital rotation, smooth inertia damping, polar angle limits, and zoom constraints.
* **FEAT-1.3 (Platform Rig)**: Circular calibration turntable with metric radial coordinates.

### 4.2 Feature Set 2: Kinematic Morphing System
* **FEAT-2.1 (Continuous Morphing Slider)**: Bidirectional $0.00$ to $1.00$ slider controlling suspension ride height, aerodynamic wings, widebody stance, and jet thruster extension.
* **FEAT-2.2 (Discrete Preset Modes)**: One-click presets (*Street Racer*, *Off-Road Rover*, *Aero Glider*) with animated frame interpolation.
* **FEAT-2.3 (Mechanism Principle Callout)**: Dynamic cards displaying governing kinematic principles and engineering descriptions.

### 4.3 Feature Set 3: Disassembly & Inspection Suite
* **FEAT-3.1 (Exploded View Disassembly)**: Progressive disassembly slider ($0\%$ to $100\%$) translating components along structural release vectors.
* **FEAT-3.2 (Planar Cross-Section Slicing)**: GPU clipping planes on Sagittal (X), Axial (Y), and Coronal (Z) axes.
* **FEAT-3.3 (Offset Depth Translation)**: Fine-grain slider ($-2.5\text{ m}$ to $+2.5\text{ m}$) controlling cutting plane position.
* **FEAT-3.4 (Sub-Assembly Isolation)**: Focus on specific assemblies with surrounding parts ghosted at $15\%$ opacity.

### 4.4 Feature Set 4: Material & Shader Customization
* **FEAT-4.1 (PBR Surface Controls)**: Real-time clearcoat, metalness, and roughness adjustments.
* **FEAT-4.2 (Palette Customization)**: Swatches for primary body, secondary accents, wheel rims, and neon underglow.
* **FEAT-4.3 (Glass Canopy)**: Transparent dielectric material with tint opacity control.

### 4.5 Feature Set 5: User Profiles & Loadout Persistence
* **FEAT-5.1 (Authentication & RBAC)**: Registration, login, and token refresh with Argon2id hashing and JWT cookies.
* **FEAT-5.2 (Custom Loadout CRUD)**: Save, retrieve, update, and delete vehicle configurations in PostgreSQL.
* **FEAT-5.3 (Favorites)**: Bookmark loadouts for immediate retrieval during laboratory sessions.

### 4.6 Feature Set 6: Telemetry & Dynamic Proving Ground
* **FEAT-6.1 (Derived Telemetry Specs)**: Real-time calculation of top velocity, handling agility, off-road traction, and aerodynamic downforce.
* **FEAT-6.2 (Proving Ground Sandbox)**: Seamless transition into driving mode with Rapier 3D raycast physics and camera follow tracking.

---

## 5. Non-Functional Requirements (NFR)

* **NFR-01 (Frame Rate)**: Maintain $\ge 50\text{ FPS}$ (target $60\text{ FPS}$) on standard integrated GPUs (Intel Iris Xe / Apple M1).
* **NFR-02 (Payload Size)**: Compressed machine `.glb` asset packages SHALL NOT exceed $3.5\text{ MB}$ per model.
* **NFR-03 (Asset Load Latency)**: Model streaming and decompression SHALL complete within $\le 2.5\text{ seconds}$ on broadband.
* **NFR-04 (API Latency)**: REST API SHALL respond to authenticated requests with $p_{95} \le 120\text{ ms}$.
* **NFR-05 (Credential Security)**: Passwords hashed with Argon2id ($\ge 64\text{ MB}$ memory cost, 3 iterations).
* **NFR-06 (Token Expiration)**: 15-minute JWT access tokens, 7-day HttpOnly refresh cookies.
* **NFR-07 (Usability Target)**: System Usability Scale (SUS) score $\ge 80.0$ ("Excellent") in formal student evaluations.

---

## 6. Verification & Traceability Matrix

| Req ID | Requirement Summary | Verification Method | Acceptance Criterion |
| :--- | :--- | :--- | :--- |
| **FR-01** | Model Catalog Selection | Automated E2E Test (Playwright) | All 3 benchmark machines load on tab click. |
| **FR-02** | 3D Orbit/Pan/Zoom Canvas | Visual Verification | Smooth 3-axis orbital navigation with bounds. |
| **FR-03** | Continuous Morph Slider | Unit Test (Vitest) & R3F Render | Morph weights interpolate smoothly from 0.0 to 1.0. |
| **FR-05** | Exploded Disassembly Slider | Visual & Math Lerp Test | Components displace along calculated vectors at 100%. |
| **FR-08** | Planar Cross-Section Slicing | Visual WebGL Inspection | Cutting plane cleanly clips geometry on X/Y/Z. |
| **FR-12** | User Authentication | Automated Test (Supertest) | 201 on registration, JWT issued, cookie set. |
| **NFR-01** | Frame Rate ($\ge 50\text{ FPS}$) | Chrome DevTools FPS Benchmark | Average FPS $\ge 50$ during active morph slider sweep. |
| **NFR-02** | Asset Payload $\le 3.5\text{ MB}$ | Network File Size Audit | Production `.glb` file size $\le 3.5\text{ MB}$. |
