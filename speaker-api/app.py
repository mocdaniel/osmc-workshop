from flask import Flask, jsonify, request

app = Flask(__name__)

# Hardcoded speaker data
SPEAKERS = [
    {
        "id": 1,
        "name": "Roman Khavronenko",
        "company": "VictoriaMetrics",
        "bio": "Roman is a software engineer with experience in distributed systems, databases, monitoring, and high-performance microservices. Roman’s passion is open source and he’s proud to have contributions to Prometheus, Grafana, and ClickHouse. Currently, Roman is working on the open source time series database and monitoring solution VictoriaMetrics.",
        "talks": [1]
    },
    {
        "id": 2,
        "name": "Mattias Schlenker",
        "company": "Checkmk GmbH",
        "bio": "Mattias Schlenker has been a freelance author in IT journalism and technical writer for 18 years before joining Checkmk GmbH as full time employee for team knowledge. His freelance legacy includes two books on Arduino and technical writing for Watterott Electronic GmbH.",
        "talks": [2]
    },
    {
        "id": 3,
        "name": "Imma Valls",
        "company": "Grafana Labs",
        "bio": "Imma is a Staff Developer Advocate at Grafana Labs where she enjoys helping users make the most out of the Grafana stack. In her past life, she worked as a consultant, trainer, and support engineer at Elastic. Imma always loved automating things and anything that helps users confidently move from development to production. She enjoys sharing with the community, and you can find her co-organizing Grafana’s meetups in Barcelona, Madrid, Amsterdam, or Lisboa, as well as Cloud Native Barcelona and Software Crafters Barcelona meetups. Imma is a member of the TechFems Barcelona community, currently serving as treasurer and coach.",
        "talks": [3]
    },
    {
        "id": 4,
        "name": "Lennart Betz",
        "company": "betadots GmbH",
        "bio": "Lennart Betz, born 1972 in Celle, has been working as a consultant in the field of configuration management and automation at betadots GmbH since February 2025. Prior to this, he worked for 14 years at NETWAYS GmbH in Nuremberg, specializing in system monitoring and automation. During this time, he also published books about the ICINGA monitoring platform.",
        "talks": [4]
    },
    {
        "id": 5,
        "name": "Jochen Kressin",
        "company": "floragunn GmbH",
        "bio": "Jochen Kressin is a seasoned CTO and serial entrepreneur with 20+ years leading high-performance teams. Co-Founder & Director at Eliatra and CEO of Search Guard, he specializes in distributed systems, cybersecurity, and open-source technologies, driving innovation across finance, healthcare, and tech industries.",
        "talks": [5]
    },
    {
        "id": 6,
        "name": "Nicolas Schneider",
        "company": "RISE GmbH",
        "bio": "Nicolas Schneider, known as moreamazingnick on the Icinga community forums, has been working at Research Industrial Systems Engineering (RISE) since 2021. He is passionate about enhancing the monitoring experience, with a particular focus on IcingaWeb2.",
        "talks": [6]
    },
    {
        "id": 7,
        "name": "Diana Todea",
        "company": "VictoriaMetrics",
        "bio": "Diana is a DX Engineer at VictoriaMetrics. She is passionate about Observability, machine learning. She is an active contributor to the OpenTelemetry CNCF open source project and supports women in tech.",
        "talks": [7]
    },
    {
        "id": 8,
        "name": "Victor Martinez",
        "company": "Elastic",
        "bio": "Victor is a principal software engineer at Elastic and lives in sunny Spain. Victor works with different teams to build and improve the CI/CD ecosystem. He has contributed to Jenkins, OpenTelemetry, and other communities for years. He loves riding his bike, eating good food, and having quality time with his family.",
        "talks": [8]
    },
    {
        "id": 9,
        "name": "Burak Ok",
        "company": "Microsoft",
        "bio": "Burak has been working in tech for over 10 years in his free time. Currently he is a Software Engineer in the Azure Core Linux group at Microsoft, where his focus is on enhancing observability for containers and Kubernetes clusters. Apart from tech he loves to do any kind of team sport.",
        "talks": [9]
    },
    {
        "id": 10,
        "name": "Birol Yildiz",
        "company": "ilert GmbH",
        "bio": "Birol Yildiz is the Co-founder and CEO of ilert, where he leads the company with a unique blend of technical and product expertise. Previously, he served as the Chief Product Owner for Big Data products at REWE Digital. With a solid background in computer science, Birol bridges the gap between developers and product strategists, continually striving to innovate and deliver customer-centric solutions at ilert.",
        "talks": [10]
    },
    {
        "id": 11,
        "name": "Dominik Schmidle",
        "company": "Giant Swarm",
        "bio": "Dominik is a Technical Product Manager at Giant Swarm and on a mission to simplify developers’ lives by delivering intuitive developer platforms. He has been in the IT industry for over 9 years, starting his journey as a Full Stack Software Engineer falling in love with DevOps and Product Organisations to later become a Product Manager for Cloud Technology. Dominik is very passionate about Cloud Transformation, Product Management and helping people. He loves contributing to the community with talks, articles, or his publications.",
        "talks": [11]
    },
    {
        "id": 12,
        "name": "Josefine Kipke",
        "company": "Open Source Business Alliance",
        "bio": "Josefine combines her background in computer science and passion for open source with a focus on sustainable digital infrastructures. As a system engineer at Open Source Business Alliance, she develops holistic approaches for measuring the environmental impact of cloud technologies in ECO:DIGIT.",
        "talks": [12]
    },
    {
        "id": 13,
        "name": "Bernd Erk",
        "company": "Netways GmbH",
        "bio": "Bernd Erk is CEO and co-founder of the Icinga Project. In his day job he is CEO at NETWAYS, an open source service company. His technical expertise stretches across systems management, managed services and software development. As a core member of DevOpsDays organizers, he tries to spread the DevOps spirit wherever and whenever possible.",
        "talks": [13]
    },
    {
        "id": 14,
        "name": "Jonah Kowall",
        "company": "Paessler",
        "bio": "Jonah Kowall is a technology executive recognized for his contributions across cybersecurity, IT operations, observability, and product leadership—from pioneering early security techniques to shaping analyst markets and leading product strategy at high-growth companies. His career launched in computer science, co-founding one of the first content filtering companies in the late 1990s and making early security contributions to the FreeBSD project, including novel wireless cracking algorithms. Armed with prestigious certifications like CCIE, CISSP, and CISA, Jonah gained 15 years of hands-on experience managing infrastructure, operations, security, and performance engineering across both startups and large enterprises. During this time, he honed his expertise in monitoring and tuning high-scale infrastructure and SaaS applications. Transitioning to industry analysis at Gartner in 2011, Jonah became a global authority on IT Operations Management (ITOM) and monitoring. He led the influential Application Performance Monitoring (APM) Magic Quadrant, created the Network Performance Monitoring and Diagnostics (NPMD) Magic Quadrant, and coined the term “Network Packet Broker” (NPB), significantly shaping these key markets. In 2015, Jonah pivoted to building products, joining AppDynamics to drive corporate development and product strategy, contributing through its $3.8 billion acquisition by Cisco. He subsequently led product and engineering initiatives at innovative startups, including Kentik (network analytics) and Logz.io (CTO, observability), before focusing on broad open-source SaaS data platforms at Aiven. Currently, Jonah serves as SVP of Product and Design at the monitoring company Paessler. He leads the product management and design teams in building the next generation of monitoring solutions for critical IT and OT environments. Jonah remains deeply committed to the open-source community, serving on the OpenSearch Project Leadership Committee and as a maintainer for Jaeger, the CNCF-graduated distributed tracing project.",
        "talks": [14]
    },
    {
        "id": 15,
        "name": "David Delassus",
        "company": "Link Society",
        "bio": "David is an autodidact developer and system operator since he has been a little kid. He has grown an interest to monitoring through his professional career. David is currently working for the European Commission as a SecOps, which is where the need for FlowG emerged.",
        "talks": [15]
    },
    {
        "id": 16,
        "name": "Samuel Desseaux",
        "company": "Eyes4IT",
        "bio": "Samuel Desseaux is an independent CTO and founder of Eyes4IT and OpenEdge Labs, specializing in IT/OT supervision, cybersecurity, and applied AI for industrial environments and public institutions. With a strong focus on open source, resilience, and sovereignty, he helps organizations design transparent, secure, and efficient infrastructures — far from the hype and black-box dependencies. As a trainer and advisor, he builds bridges between strategic vision and operational deployment, particularly around monitoring architectures, AI observability, and industrial cybersecurity (NIS2). His approach is hands-on, pragmatic, and designed to empower teams — especially in SMEs and mid-sized industrial organizations.",
        "talks": [16]
    },
    {
        "id": 17,
        "name": "Jose Gomez-Selles",
        "company": "VictoriaMetrics",
        "bio": "Jose is the Product Lead for VictoriaMetrics Cloud. With a focus on Observability and Sustainability, his work has been deeply related to the OpenTelemetry project, distributed tracing and power monitoring projects. His expertise has been built from previous gigs as a Software Architect, Tech Lead and Product Owner in the Telecommunications industry, all the way from the software programming trenches where agile ways of working where a sound CI, testing and observability best practices have presented themselves as the main principles that drive every successful project. With a scientific background in Physics and a PhD in Computational Materials Engineering, curiosity, openness and a pragmatic view are always expected. Beyond the boardroom, he is a C++ enthusiast and a creative force: contributing symphonic touches as a keyboardist in metal bands, when he is not playing video games or lowering lap times at the simracing cockpit. He also loves to spend time teaching Physics to Vet students in the Complutense University of Madrid, as an Associate Professor.",
        "talks": [17]
    },
    {
        "id": 18,
        "name": "Karsten Fischer",
        "company": "Giesecke + Devrient",
        "bio": "Karsten Fischer, born in 1966, has been an IT administrator since 1991. He has extensive experience with both Icinga and GLPI, having used them for many years in managing and supporting IT environments.",
        "talks": [18]
    },
    {
        "id": 19,
        "name": "Susobhit Panigrahi",
        "company": "VMware",
        "bio": "Susobhit works as a Developer and DevOps Engineer at VMware, focusing on scalable cloud software using microservices. He contributes to open-source projects, including VMware’s Xenon microservice architecture. Fascinated by Kubernetes and its role in deploying and managing production systems, Susobhit aims to learn and contribute to the open-source community. He has attended, spoken and organized multiple conferences like KubeCon, SRECon, KCD etc. in the past and would love to explore more to exchange ideas and knowledge with the larger community.",
        "talks": [19]
    },
    {
        "id": 20,
        "name": "Jan-Piet Mens",
        "company": "Independent",
        "bio": "Jan-Piet Mens is an independent Unix/Linux consultant and sysadmin who’s worked with Unix-systems since 1985. JP does odd bits of coding, and works extensively with the Domain Name System and as such, he authored the book Alternative DNS Servers as well as a variety of other technical publications. He contributed several modules and the documentation system to the Ansible project and dreamed up the Open Source (MQTT-based) OwnTracks project. JP blogs at https://jpmens.net",
        "talks": [20]
    },
    {
        "id": 21,
        "name": "Kamal Bisht",
        "company": "Discover Financial Services",
        "bio": "Kamal Singh Bisht is a seasoned technologist with over 18 years of experience across observability, AI/ML, and cybersecurity. He has held senior engineering and leadership roles at organizations like JPMorgan Chase, Zillow, and Discover Financial Services, where he specialized in building intelligent, scalable platforms for analytics and infrastructure monitoring. Kamal’s expertise lies in bridging advanced machine learning techniques—including Generative AI and LLMs—with real-world production systems. His recent work focuses on automating root cause analysis and anomaly detection in large-scale IT environments using AI-driven observability architectures. He has completed master’s from Bangalore University and Post Graduate Program in Artificial Intelligence and Machine Learning from the University of Texas at Austin. Kamal is also the author of technical publications https://al-kindipublisher.com/index.php/jcsts/article/view/9558 https://eajournals.org/ejcsit/vol13-issue27-2025/conversational-finance-llm-powered-payment-assistant-architecture/ and is actively contributing to the advancement of AI in enterprise observability.",
        "talks": [21]
    },
    {
        "id": 22,
        "name": "Jens Michelsons",
        "company": "Allgeier IT Services",
        "bio": "Jens Michelsons is an experienced IT monitoring geek in the age of 42. He is happily married, has two children and a cute beagle at his side. He has worked in various positions in the IT industry for more than 15 years and has gained a wide range of experience. He began his career as an OpenNMS consultant and project manager at a regional ISP in Fulda. He then worked as a Senior Consultant and Team Leader Consulting at it-novum in the field of IT monitoring with Nagios-based systems, in particular with openITCOCKPIT. After a few stops, including an SAP provider in Grafenrheinfeld, where he was in responsible for a Checkmk environment, and Fulda University of Applied Sciences, where he was Head of Service for the Service Desk and some IT operations services, he returned to his roots as a Product and Community Manager for openITCOCKPIT.",
        "talks": [22]
    },
    {
        "id": 23,
        "name": "Sven Nierlein",
        "company": "ConSol Consulting & Solutions Software GmbH",
        "bio": "Sven Nierlein works as monitoring expert, consultant and software developer at Consol Software GmbH in Munich and uses Linux for more than 20 years so far. He creates concepts, is developing customer solutions and works on monitoring related opensource projects. He is the founder of SNClient, Thruk, LMD, Mod-Gearman and is member of the OMD, Naemon and Monitoring-Plugins team.",
        "talks": [23]
    },
    {
        "id": 24,
        "name": "Colin Douch",
        "company": "DuckDuckGo",
        "bio": "Colin previously tech led the Observability Team at Cloudflare, but currently works at DuckDuckGo focusing on improving the external reliability and internal observability of DuckDuckGo’s increasingly complex set of privacy preserving products. Starting in mining, he has been working, advising, and researching in the Monitoring and Observability space for close to 15 years gaining a wide perspective into the difficulties that modern companies, big, and small deal with in properly introspecting their systems. Originally from New Zealand, he currently lives in London where he frequently runs talks on Observability developments, introducing new graduates to the world of Observability and usually teaching the old timers something new too.",
        "talks": [24]
    },
    {
        "id": 25,
        "name": "Bekir-Tolga Tutuncuoglu",
        "company": "TTNC Teknoloji",
        "bio": "Tolga Tutuncuoglu is a tech leader and AI architect based in Florida. He founded Hozzt.com and Hoxt.net, serves as an IEEE Senior Member and IET Fellow, and speaks globally on AI, cybersecurity, and automation. He also leads AIProw.com with 240K+ readers.",
        "talks": [25]
    },
    {
        "id": 26,
        "name": "Gabor Bukovszki",
        "company": "Giesecke + Devrient",
        "bio": "Gabor is an Infrastructure Architect at G+D with a strong Linux background. He comes from a divison which provides infrastructure (hosting, network) services for the internal Business Units. Besides being an architect creating high level hosting blueprints in different projects, Gabor also does hands on engineering. Monitoring, containers, automation are among his favourite technologies where he likes to dig deeper. Gabor is in IT for 15+ years and had the opportunity to gather experience with companies like BMW, T-Systems before my life as part of G+D.",
        "talks": [26]
    },
    {
        "id": 27,
        "name": "Andreas Decker",
        "company": "comNET GmbH",
        "bio": "Andreas Decker is an IT Consultant for Open Source Software and Monitoring with a background in software development and Linux. Hailing from Kassel and having originally studied Psychology, he pivoted to Computer Science late in his studies, getting started in freelance development, until committing to test development and automation in the automobile industry in Hannover for several years. Recently, he has become a core member of comNET Solution’s Open-Source Software Consulting Team, where he works with customers across industries to optimize their monitoring, automate administrative tasks, and tailor software where necessary.",
        "talks": [27]
    },
    {
        "id": 28,
        "name": "Daniel Mitterdorfer",
        "company": "Elastic",
        "bio": "Daniel Mitterdorfer is tech lead of Elastic’s performance engineering team. Prior to that he spearheaded benchmark methodology and tooling for Elasticsearch and worked on the backend of an always-on, fleet-wide profiler. He is interested in all aspects around systems performance.",
        "talks": [28]
    }
]

@app.route("/api/speakers", methods=["GET"])
def get_speakers():
    # Return list without bio
    result = [
        {
            "id": s["id"],
            "name": s["name"],
            "company": s["company"],
            "bio": s["bio"],
            "talks": s["talks"]
        }
        for s in SPEAKERS
    ]
    return jsonify(result)

@app.route("/api/speaker/<int:speaker_id>", methods=["GET"])
def get_speaker(speaker_id):
    speaker = next((s for s in SPEAKERS if s["id"] == speaker_id), None)
    if not speaker:
        # Return a JSON error response instead of the default HTML error page
        return jsonify({"error": "Speaker not found"}), 404
    return jsonify(speaker)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
