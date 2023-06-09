package org.a204.hourgoods;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Retention(RetentionPolicy.RUNTIME)
@ActiveProfiles(profiles = {"local", "test"})
@Target({ElementType.TYPE})
public @interface CustomSpringBootTest {
}
