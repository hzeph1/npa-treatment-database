-- ============================================================
-- NPA Treatment Database — seed data
-- Run AFTER creating the tables (schema is in the .jsx footer).
-- Safe to re-run: every insert uses ON CONFLICT (upsert / do nothing).
-- ============================================================

-- Categories
insert into categories (id, label, sort) values ('abi', 'Acquired Brain Injury', 0) on conflict (id) do update set label=excluded.label, sort=excluded.sort;
insert into categories (id, label, sort) values ('neuro', 'Neurodegenerative', 1) on conflict (id) do update set label=excluded.label, sort=excluded.sort;
insert into categories (id, label, sort) values ('dev', 'Developmental', 2) on conflict (id) do update set label=excluded.label, sort=excluded.sort;
insert into categories (id, label, sort) values ('mental', 'Mental & Emotional Health', 3) on conflict (id) do update set label=excluded.label, sort=excluded.sort;
insert into categories (id, label, sort) values ('pain', 'Pain', 4) on conflict (id) do update set label=excluded.label, sort=excluded.sort;
insert into categories (id, label, sort) values ('epilepsy', 'Epilepsy', 5) on conflict (id) do update set label=excluded.label, sort=excluded.sort;

-- Therapies (shared library)
insert into therapies (id, name, type, summary, evidence, modality) values ('cimt', 'Constraint-Induced Movement Therapy (CIMT)', 'Motor rehabilitation', 'Restrains the unaffected limb to force intensive, repetitive use of the affected limb, driving cortical remapping of motor function.', 'Strong', 'In-clinic, therapist-led') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('mirror', 'Mirror Therapy', 'Motor / perceptual', 'Uses a mirror reflection of the intact limb to create the visual illusion of normal movement, recruiting neuroplastic pathways for the affected side.', 'Moderate', 'In-clinic or home program') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('tms', 'Transcranial Magnetic Stimulation (TMS)', 'Neuromodulation', 'Non-invasive magnetic pulses stimulate or inhibit targeted cortical regions to rebalance activity between hemispheres after injury.', 'Moderate–Strong', 'In-clinic, device-based') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('aphasia', 'Intensive Aphasia Therapy', 'Speech & language', 'High-dose, task-specific language practice that leverages plasticity in perilesional and right-hemisphere language networks.', 'Strong', 'Therapist-led, high frequency') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('fes', 'Functional Electrical Stimulation (FES)', 'Neuromuscular', 'Electrical impulses activate weakened muscles during functional tasks, pairing movement intent with sensory feedback to reinforce motor circuits.', 'Moderate', 'In-clinic or wearable') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('vr', 'Virtual Reality Rehabilitation', 'Task-specific training', 'Immersive, gamified environments deliver high-repetition, motivating practice with real-time feedback to accelerate motor and cognitive recovery.', 'Emerging', 'In-clinic or home device') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('cogrehab', 'Cognitive Rehabilitation Therapy', 'Cognitive', 'Structured retraining of attention, memory, and executive function using restorative drills and compensatory strategies to rebuild damaged cognitive networks.', 'Strong', 'Therapist-led, structured program') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('vestibular', 'Vestibular Rehabilitation', 'Balance & sensory', 'Graded gaze-stabilization and balance exercises retrain the brain to compensate for disrupted vestibular signals, reducing dizziness and instability after injury.', 'Moderate–Strong', 'Therapist-led, home exercises') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;
insert into therapies (id, name, type, summary, evidence, modality) values ('nfb', 'Neurofeedback (EEG Biofeedback)', 'Neuromodulation', 'Real-time display of the person''s own brainwave activity lets them learn to self-regulate cortical patterns, targeting attention, sleep, and emotional regulation.', 'Emerging', 'In-clinic, device-based') on conflict (id) do update set name=excluded.name, type=excluded.type, summary=excluded.summary, evidence=excluded.evidence, modality=excluded.modality;

-- Rehabilitation centers
insert into centers (id, name, location, focus) values ('select', 'Select Neuro Rehabilitation Institute', 'Louisville, KY', 'Stroke, TBI, intensive motor recovery') on conflict (id) do update set name=excluded.name, location=excluded.location, focus=excluded.focus;
insert into centers (id, name, location, focus) values ('bridge', 'Bridge Recovery Center', 'Atlanta, GA', 'Aphasia, cognitive rehabilitation') on conflict (id) do update set name=excluded.name, location=excluded.location, focus=excluded.focus;
insert into centers (id, name, location, focus) values ('summit', 'Summit Brain Injury Program', 'Boston, MA', 'TBI, cognitive & vestibular rehabilitation') on conflict (id) do update set name=excluded.name, location=excluded.location, focus=excluded.focus;

-- Conditions
insert into conditions (id, name, category, status, overview, "docUrl") values ('stroke', 'Stroke', 'abi', 'ready', 'Stroke interrupts blood flow to part of the brain, causing loss of function in the areas it controls. Because the brain can reorganize, targeted, high-intensity therapy can help recruit healthy tissue to take over lost abilities — the core premise of applied neuroplasticity.', 'https://docs.google.com/document/d/1Oh5cauyB-zQW4LEhsXnlHU4uz') on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('tbi', 'Traumatic Brain Injury | TBI', 'abi', 'ready', 'A traumatic brain injury results from an external force — a fall, collision, or blow to the head — that disrupts normal brain function. Effects range from brief concussion to lasting changes in movement, thinking, and mood. Because recovery depends on the brain forming new connections around the injured tissue, structured neuroplasticity-based rehabilitation is central to regaining function.', 'https://docs.google.com/document/d/1aKP9m_24h-vakxEKKN3-v3LOko3jPOZfH') on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('alzheimers', 'Alzheimer''s Disease', 'neuro', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('ms', 'Multiple Sclerosis', 'neuro', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('parkinsons', 'Parkinson''s Disease', 'neuro', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('dyslexia', 'Dyslexia', 'dev', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('adhd', 'ADHD', 'dev', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('autism', 'Autism', 'dev', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('devdelay', 'Developmental Delays', 'dev', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('anxiety', 'Anxiety', 'mental', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('depression', 'Depression', 'mental', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('ptsd', 'PTSD/Trauma & Addiction', 'mental', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('pain', 'Persistent Pain', 'pain', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('migraine', 'Migraine - Headaches', 'pain', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";
insert into conditions (id, name, category, status, overview, "docUrl") values ('epilepsy', 'Epilepsy', 'epilepsy', 'draft', null, null) on conflict (id) do update set name=excluded.name, category=excluded.category, status=excluded.status, overview=excluded.overview, "docUrl"=excluded."docUrl";

-- Condition symptoms (ordered; composite key → upsert on re-run)
insert into condition_symptoms (condition_id, symptom, sort) values ('stroke', 'Weakness or paralysis on one side (hemiparesis)', 0) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('stroke', 'Difficulty speaking or understanding language (aphasia)', 1) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('stroke', 'Loss of coordination or balance', 2) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('stroke', 'Vision changes', 3) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('stroke', 'Cognitive or memory difficulties', 4) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('tbi', 'Persistent headaches', 0) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('tbi', 'Difficulty concentrating or remembering (cognitive fog)', 1) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('tbi', 'Dizziness or balance problems', 2) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('tbi', 'Mood changes, irritability, or depression', 3) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('tbi', 'Sensitivity to light or noise', 4) on conflict (condition_id, symptom) do update set sort=excluded.sort;
insert into condition_symptoms (condition_id, symptom, sort) values ('tbi', 'Fatigue and disrupted sleep', 5) on conflict (condition_id, symptom) do update set sort=excluded.sort;

-- Condition ↔ therapy links (many-to-many)
insert into condition_therapies (condition_id, therapy_id) values ('stroke', 'cimt') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('stroke', 'mirror') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('stroke', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('stroke', 'aphasia') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('stroke', 'fes') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('stroke', 'vr') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('tbi', 'cogrehab') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('tbi', 'vestibular') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('tbi', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('tbi', 'vr') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('tbi', 'fes') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('tbi', 'nfb') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('alzheimers', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('ms', 'fes') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('ms', 'vr') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('parkinsons', 'vr') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('parkinsons', 'fes') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('anxiety', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('depression', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('ptsd', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('pain', 'mirror') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('pain', 'tms') on conflict do nothing;
insert into condition_therapies (condition_id, therapy_id) values ('migraine', 'tms') on conflict do nothing;

-- Condition ↔ center links
insert into condition_centers (condition_id, center_id) values ('stroke', 'select') on conflict do nothing;
insert into condition_centers (condition_id, center_id) values ('stroke', 'bridge') on conflict do nothing;
insert into condition_centers (condition_id, center_id) values ('tbi', 'summit') on conflict do nothing;
insert into condition_centers (condition_id, center_id) values ('tbi', 'select') on conflict do nothing;
