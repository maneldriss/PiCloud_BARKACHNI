package com.barkachni.barkachni.Services.blog;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;


@Service
public class PurgoMalumFilterService {

    private final String API_URL = "https://www.purgomalum.com/service/containsprofanity?text=";

    @Autowired
    private RestTemplate restTemplate;

    public boolean containsBadWords(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }

        String url = API_URL + UriUtils.encode(text, StandardCharsets.UTF_8);
        String response = restTemplate.getForObject(url, String.class);
        return Boolean.parseBoolean(response);
    }

    public String filter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        String url = "https://www.purgomalum.com/service/json?text=" +
                UriUtils.encode(text, StandardCharsets.UTF_8) +
                "&fill_char=*";
        PurgoMalumResponse response = restTemplate.getForObject(url, PurgoMalumResponse.class);
        return response != null ? response.getResult() : text;
    }

    @Data
    private static class PurgoMalumResponse {
        private String result;
    }
}

