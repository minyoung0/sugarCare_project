package com.example.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;



import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ScrapController {

    private final RestTemplate restTemplate = new RestTemplate();


    @GetMapping("/hello")
    public ResponseEntity<String> getHello() {
        // FastAPI 서버 호출
        String url = "http://localhost:8000/hello";
        String response = restTemplate.getForObject(url, String.class);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/scrape")
    public ResponseEntity<?> scrape(@RequestParam String query) {
        try {
            System.out.println("스크랩");
            // Python 실행
            ProcessBuilder pb = new ProcessBuilder("python", "./fastapi-scraper/scrap.py", query);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 결과 읽기
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.status(500).body("Python 실행 오류");
            }

            // JSON 문자열 → Java 객체 변환
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> items = mapper.readValue(output.toString(), new TypeReference<List<Map<String,Object>>>(){});

            return ResponseEntity.ok(items);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("스크래핑 실패: " + e.getMessage());
        }
    }
}
