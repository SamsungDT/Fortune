package dsko.hier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class HierApplication {

    public static void main(String[] args) {
        SpringApplication.run(HierApplication.class, args);
    }

}
