package com.reactpractice.lee.dao;

import com.reactpractice.lee.security.CustomUserDetails;
import com.reactpractice.lee.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    UserVO findUserName(String id);

    void updatePass(UserVO userVO);

    void insertUser(UserVO userVO);

    CustomUserDetails getUserById(int parseInt);
}
